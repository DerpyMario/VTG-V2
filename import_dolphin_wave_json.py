bl_info = {  
    "name": "Import DolphinWave JSON Model",
    "author": "Nya222",
    "version": (1, 26),
    "blender": (3, 0, 0),
    "location": "File > Import > DolphinWave JSON (.json)",
    "description": "Imports DolphinWave model with bones, UVs, weights, textures, and custom normals",
    "category": "Import-Export",
}

import bpy, json, os
from bpy.props import StringProperty
from bpy_extras.io_utils import ImportHelper
from mathutils import Vector, Quaternion

def swap_z_y(vec):
    return Vector((vec[0], -vec[2], vec[1]))

def convert_quaternion_xzyw(q):
    return Quaternion((q[3], q[0], -q[2], q[1]))

class ImportDolphinWaveJSON(bpy.types.Operator, ImportHelper):
    bl_idname = "import_scene.dolphinwave_json"
    bl_label = "Import DolphinWave JSON"
    filename_ext = ".json"
    filter_glob: StringProperty(default="*.json", options={'HIDDEN'})

    texture_folder: StringProperty(
        name="Texture Folder",
        description="Folder where texture images are stored",
        subtype='DIR_PATH'
    )

    def draw(self, context):
        self.layout.prop(self, "texture_folder")

    def execute(self, context):
        return self.load_model(self.filepath)

    def load_model(self, filepath):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
        except UnicodeDecodeError:
            with open(filepath, "r", encoding="cp932") as f:
                data = json.load(f)

        nodes = data["model"]["nodes"]
        meshes = data["model"].get("meshes", [])
        materials = data["model"].get("materials", [])
        skinning_nodes = data["model"].get("skinning_nodes", [])

        bpy.ops.object.add(type="ARMATURE", enter_editmode=True)
        arm_obj = bpy.context.object
        arm_obj.name = "Armature"
        arm = arm_obj.data
        arm.name = "ArmatureData"

        arm_obj.show_in_front = True
        arm.display_type = 'STICK'

        bone_map = {}
        world_positions = {}
        world_rotations = {}

        def compute_world_transform(idx):
            node = nodes[idx]
            trans = Vector(node["translation"])
            rot = convert_quaternion_xzyw(node.get("rotation", [0, 0, 0, 1]))
            scale = node.get("scale", [1, 1, 1])
            trans *= Vector(scale)
            trans = swap_z_y(trans)
            rot_converted = rot

            pid = node.get("parent_index", -1)
            if pid >= 0:
                parent_pos, parent_rot = compute_world_transform(pid)
                trans = parent_pos + parent_rot @ trans
                rot_converted = parent_rot @ rot
            return trans, rot_converted

        for node in nodes:
            idx = node["idx"]
            pos, rot = compute_world_transform(idx)
            world_positions[idx] = pos
            world_rotations[idx] = rot

        for node in nodes:
            idx = node["idx"]
            name = node["name"]
            if not name.strip():
                name = f"Bone_{idx}"
            elif name in bone_map:
                name += f"_{idx}"

            bone = arm.edit_bones.new(name)
            bone.head = world_positions[idx]

            direction = world_rotations[idx] @ Vector((0, 0.01, 0))
            bone.tail = bone.head + direction

            bone_map[idx] = bone

        for node in nodes:
            idx = node["idx"]
            pid = node.get("parent_index", -1)
            if pid >= 0 and pid in bone_map:
                bone_map[idx].parent = bone_map[pid]
                bone_map[idx].use_connect = True

        bpy.ops.object.mode_set(mode='OBJECT')

        skinning_bone_map = {
            i: nodes[idx]["name"] if nodes[idx]["name"].strip() else f"Bone_{idx}"
            for i, idx in enumerate(skinning_nodes)
            if idx < len(nodes)
        }

        def find_texture_image(tex_name):
            if not self.texture_folder:
                return None
            for f in os.listdir(self.texture_folder):
                if f.lower().startswith(tex_name.lower()):
                    return os.path.join(self.texture_folder, f)
            return None

        material_list = []
        for i, mat in enumerate(materials):
            mat_name = mat.get("name", f"Material_{i}")
            m = bpy.data.materials.new(name=mat_name)
            m.use_nodes = True
            bsdf = m.node_tree.nodes.get("Principled BSDF")

            tex_name = None
            for tex in mat.get("textures", []):
                tex_name = tex.get("texture_name")
                if tex_name:
                    break

            tex_path = find_texture_image(tex_name) if tex_name else None
            if tex_path and bsdf:
                try:
                    tex_img = bpy.data.images.load(tex_path)
                    tex_node = m.node_tree.nodes.new("ShaderNodeTexImage")
                    tex_node.image = tex_img
                    m.node_tree.links.new(bsdf.inputs["Base Color"], tex_node.outputs["Color"])
                except Exception as e:
                    print(f"[WARN] Failed to load texture '{tex_path}': {e}")

            material_list.append(m)

        for mesh in meshes:
            verts = []
            faces = []
            weights = {}
            normals = []

            mesh_name = mesh.get("name")
            if not mesh_name or not mesh_name.strip():
                idx = mesh.get("idx")
                mesh_name = f"Mesh_{idx}" if idx is not None else "Mesh"

            vertices = mesh.get("vertices", [])
            if not vertices:
                continue

            for i, v in enumerate(vertices):
                pos_raw = v.get("position")
                if not pos_raw or len(pos_raw) != 3:
                    continue
                verts.append(swap_z_y(Vector(pos_raw)))

                normal = v.get("normal")
                if normal and len(normal) == 3:
                    normals.append(swap_z_y(Vector(normal)).normalized())
                else:
                    normals.append(Vector((0, 0, 1)))

                bone_idxs = v.get("bone_idx", [])
                raw_weights = v.get("bone_weights", [])
                if len(bone_idxs) != len(raw_weights):
                    continue

                if raw_weights:
                    wts = [w / 255.0 for w in raw_weights]
                    total = sum(wts)
                    wts = [w / total if total else 0 for w in wts]
                    if total == 0:
                        wts[0] = 1.0
                    weights[i] = list(zip(bone_idxs, wts))

            for f in mesh.get("faces", []):
                if len(f) >= 3:
                    faces.append(tuple(f))

            if not verts or not faces:
                continue

            mesh_data = bpy.data.meshes.new(mesh_name)
            mesh_data.from_pydata(verts, [], faces)
            mesh_data.update()
            for poly in mesh_data.polygons:
                poly.use_smooth = True

            obj = bpy.data.objects.new(mesh_name, mesh_data)
            bpy.context.collection.objects.link(obj)

            if normals and len(normals) == len(verts):
                custom_normals = []
                for poly in mesh_data.polygons:
                    for li in poly.loop_indices:
                        vidx = mesh_data.loops[li].vertex_index
                        custom_normals.append(normals[vidx])
                try:
                    mesh_data.normals_split_custom_set(custom_normals)
                    mesh_data.use_auto_smooth = True
                except:
                    pass

            midx = mesh.get("material_index", 0)
            if 0 <= midx < len(material_list):
                mesh_data.materials.append(material_list[midx])

            if "uv0" in vertices[0]:
                mesh_data.uv_layers.new(name="UVMap")
                uv_layer = mesh_data.uv_layers.active.data
                for poly in mesh_data.polygons:
                    for li in poly.loop_indices:
                        vidx = mesh_data.loops[li].vertex_index
                        uv = vertices[vidx].get("uv0", [0.0, 0.0])
                        uv_layer[li].uv = (uv[0], 1.0 - uv[1])

            mod = obj.modifiers.new("Armature", "ARMATURE")
            mod.object = arm_obj

            for bone in arm.bones:
                if not obj.vertex_groups.get(bone.name):
                    obj.vertex_groups.new(name=bone.name)

            for vidx, bone_wts in weights.items():
                for bone_idx, weight in bone_wts:
                    bone_name = skinning_bone_map.get(bone_idx)
                    if not bone_name:
                        continue
                    vg = obj.vertex_groups.get(bone_name)
                    if not vg:
                        vg = obj.vertex_groups.new(name=bone_name)
                    vg.add([vidx], weight, 'REPLACE')

            obj.parent = arm_obj

        self.report({'INFO'}, f"Imported {len(meshes)} mesh(es), {len(nodes)} bones.")
        return {'FINISHED'}

def menu_func_import(self, context):
    self.layout.operator(ImportDolphinWaveJSON.bl_idname, text="DolphinWave JSON (.json)")

def register():
    bpy.utils.register_class(ImportDolphinWaveJSON)
    bpy.types.TOPBAR_MT_file_import.append(menu_func_import)

def unregister():
    bpy.utils.unregister_class(ImportDolphinWaveJSON)
    bpy.types.TOPBAR_MT_file_import.remove(menu_func_import)

if __name__ == "__main__":
    register()
