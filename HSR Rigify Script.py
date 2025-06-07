### IMPORTANT: YOU NEED THE ADDON EXPYKIT AND **IF** YOU'RE NOT USING THE HSR SETUP ADDON AND IMPORTING THE MODEL YOURSELF, YOU NEED 'Automatic Bone Orientation' TURNED ON UNDER 'Armature' WHEN YOU IMPORT THE FBX.

import bpy
context = bpy.context
obj = context.object
if obj.name[-4:] == ".001":
     obj.name = obj.name[:-4]
print("New Run\n\n")

ver = bpy.app.version_string
if ver[0] == '4':
    ver = 4
elif ver[0] == '3':
    ver = 3
else:
    raise Exception("youre using blender 3 or blender 4 right??")

## Rename all bones in selected armature to ORG

original_name = obj.name
abadidea = {
    'Root_M': 'DEF-spine',
    'Hip_L': 'DEF-thigh.L',
    'Knee_L': 'DEF-shin.L',
    'Ankle_L': 'DEF-foot.L',
    'Toes_L': 'DEF-toe.L',
    'Hip_R': 'DEF-thigh.R',
    'Knee_R': 'DEF-shin.R',
    'Ankle_R': 'DEF-foot.R',
    'Toes_R': 'DEF-toe.R',
    'Spine1_M': 'DEF-spine.001',
    'Spine2_M': 'DEF-spine.002',
    'Chest_M': 'DEF-spine.003',
    'Scapula_L': 'DEF-shoulder.L',
    'Shoulder_L': 'DEF-upper_arm.L',
    'Elbow_L': 'DEF-forearm.L',
    'Wrist_L': 'DEF-hand.L',
    'ThumbFinger1_L': 'DEF-thumb.01.L',
    'ThumbFinger2_L': 'DEF-thumb.02.L',
    'ThumbFinger3_L': 'DEF-thumb.03.L',
    'IndexFinger1_L': 'DEF-f_index.01.L',
    'IndexFinger2_L': 'DEF-f_index.02.L',
    'IndexFinger3_L': 'DEF-f_index.03.L',
    'MiddleFinger1_L': 'DEF-f_middle.01.L',
    'MiddleFinger2_L': 'DEF-f_middle.02.L',
    'MiddleFinger3_L': 'DEF-f_middle.03.L',
    'RingFinger1_L': 'DEF-f_ring.01.L',
    'RingFinger2_L': 'DEF-f_ring.02.L',
    'RingFinger3_L': 'DEF-f_ring.03.L',
    'PinkyFinger1_L': 'DEF-f_pinky.01.L',
    'PinkyFinger2_L': 'DEF-f_pinky.02.L',
    'PinkyFinger3_L': 'DEF-f_pinky.03.L',
    'Neck_M': 'DEF-spine.004', #YO
    'Head_M': 'DEF-spine.006', #RUHROH
    'Scapula_R': 'DEF-shoulder.R',
    'Shoulder_R': 'DEF-upper_arm.R',
    'Elbow_R': 'DEF-forearm.R',
    'Wrist_R': 'DEF-hand.R',
    'ThumbFinger1_R': 'DEF-thumb.01.R',
    'ThumbFinger2_R': 'DEF-thumb.02.R',
    'ThumbFinger3_R': 'DEF-thumb.03.R',
    'IndexFinger1_R': 'DEF-f_index.01.R',
    'IndexFinger2_R': 'DEF-f_index.02.R',
    'IndexFinger3_R': 'DEF-f_index.03.R',
    'MiddleFinger1_R': 'DEF-f_middle.01.R',
    'MiddleFinger2_R': 'DEF-f_middle.02.R',
    'MiddleFinger3_R': 'DEF-f_middle.03.R',
    'RingFinger1_R': 'DEF-f_ring.01.R',
    'RingFinger2_R': 'DEF-f_ring.02.R',
    'RingFinger3_R': 'DEF-f_ring.03.R',
    'PinkyFinger1_R': 'DEF-f_pinky.01.R',
    'PinkyFinger2_R': 'DEF-f_pinky.02.R',
    'PinkyFinger3_R': 'DEF-f_pinky.03.R',
    'eye_R': 'DEF-eye.R',
    'eye_L': 'DEF-eye.L',   
    'breast_L': 'DEF-breast.L',
    'breast_R': 'DEF-breast.R', 
    
    'Spine2_scale': 'DEF-spine.002',
    'Spine1_scale': 'DEF-spine.001',
    'Chest_scale': 'DEF-spine.003',
    'HipPart1_R': 'DEF-thigh.R.001',
    'HipPart1_L': 'DEF-thigh.L.001',
    'ElbowPart1_L': 'DEF-forearm.L.001',
    'ElbowPart1_R': 'DEF-forearm.R.001',
    'ShoulderPart1_R': 'DEF-upperarm.R.001',
    'ShoulderPart1_L': 'DEF-upperarm.L.001',
    'head_m': 'DEF-spine.006',
    }


bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.armature.reveal()
armature = bpy.context.selected_objects[0].data

bpy.ops.armature.select_all(action='DESELECT')
def select_bone(bone):
    bone.select = True
    bone.select_head = True
    bone.select_tail = True
    
bones_list = obj.pose.bones
for bone in bones_list:
    if bone.name in abadidea:
        bone.name = abadidea[bone.name]

#armature.edit_bones["DEF-shoulder.R"].roll -= 3.14
#armature.edit_bones["DEF-shoulder.L"].roll += 3.14

# For making it possible to symmetrically pose bones properly.
for bone in bones_list:
    if ".L" in bone.name and bone.name not in ['DEF-spine.002','DEF-spine.001','DEF-spine.003','DEF-thigh.R.001','DEF-thigh.L.001','DEF-forearm.L.001','DEF-forearm.R.001','DEF-upperarm.R.001','DEF-upperarm.L.001','DEF-spine.006']: 
        whee = bone.name[:-2] + ".R"
        armature.edit_bones[whee].roll = -armature.edit_bones[bone.name].roll # R to L because rolls suck less
    
## Fixes the weirdass head bone alignment.   
def realign(bone):
    bone.head.x = 0
    bone.tail.x = 0
    bone.tail.y = bone.head.y
    if bone.tail.z < bone.head.z:
        bone.tail.z = bone.head.z + .1
    else:
        bone.tail.z += .1
        
    bone.roll = 0
realign(armature.edit_bones['DEF-spine.006'])

## Attaches the feet to the toes and the upperarms to lowerarms
def attachfeets(foot, toe):
    armature.edit_bones[foot].tail.x = armature.edit_bones[toe].head.x
    armature.edit_bones[foot].tail.y = armature.edit_bones[toe].head.y
    armature.edit_bones[foot].tail.z = armature.edit_bones[toe].head.z
    armature.edit_bones[foot].roll = 0

attachfeets('DEF-foot.L', 'DEF-toe.L')
attachfeets('DEF-foot.R', 'DEF-toe.R')
attachfeets('DEF-upper_arm.L', 'DEF-forearm.L')
attachfeets('DEF-upper_arm.R', 'DEF-forearm.R')
attachfeets('DEF-thigh.L', 'DEF-shin.L')
attachfeets('DEF-thigh.R', 'DEF-shin.R')
attachfeets('DEF-forearm.L', 'DEF-hand.L')
attachfeets('DEF-forearm.R', 'DEF-hand.R')

attachfeets('DEF-shoulder.R', 'DEF-upper_arm.R')
attachfeets('DEF-shoulder.L', 'DEF-upper_arm.L')

attachfeets('DEF-spine', 'DEF-spine.001')
attachfeets('DEF-spine.001', 'DEF-spine.002')
attachfeets('DEF-spine.002', 'DEF-spine.003')
attachfeets('DEF-spine.003', 'DEF-spine.004')
attachfeets('DEF-spine.004', 'DEF-spine.006')

## Points toe bones in correct direction
for x in ['.L', '.R']:
    toe = 'DEF-toe'
    armature.edit_bones[toe + x].tail.z = armature.edit_bones[toe + x].head.z
    armature.edit_bones[toe + x].tail.y -= 0.05
    armature.edit_bones[toe + x].roll = 0

# Fixes the thumb scale rotating inward on x instead of z
#armature.edit_bones["DEF-thumb.01.L"].roll += 3.14 / 2
#armature.edit_bones["DEF-thumb.02.L"].roll += 3.14 / 2
#armature.edit_bones["DEF-thumb.03.L"].roll += 3.14 / 2     
#armature.edit_bones["DEF-thumb.01.R"].roll -= 3.14 / 2
#armature.edit_bones["DEF-thumb.02.R"].roll -= 3.14 / 2
#armature.edit_bones["DEF-thumb.03.R"].roll -= 3.14 / 2    
        
bpy.ops.armature.select_all(action='DESELECT')
try:
    select_bone(armature.edit_bones["breast.R"])
    bpy.ops.armature.symmetrize()
    bpy.ops.armature.select_all(action='DESELECT')

except Exception:
    pass

# DElete joint_skin_GRP and replace joint_face parent with DEF-spine.006
armature.edit_bones.remove(armature.edit_bones["joint_skin_GRP"])
armature.edit_bones["joint_face"].parent = armature.edit_bones["DEF-spine.006"]

#armature.edit_bones["joint_skin_GRP"].head.z = armature.edit_bones["joint_skin_GRP"].tail.z
#armature.edit_bones["joint_skin_GRP"].tail.z += 0.1
armature.edit_bones["Main"].tail.z = 0.1
armature.edit_bones["Main"].tail.y = 0
# DELETE MAIN BONE?? 
#armature.edit_bones.remove(armature.edit_bones["Main"])

try:  # If tall woman, fix their pinky finger
    if armature.edit_bones["DEF-breast.R"] and armature.edit_bones["DEF-spine.003"].tail.z > 1.3 and armature.edit_bones["DEF-spine.003"].tail.z < 1.4:
        bpy.context.object.data.use_mirror_x = True
        armature.edit_bones["DEF-f_pinky.01.L"].tail.x += 0.00164
        armature.edit_bones["DEF-f_pinky.02.L"].tail.x += 0.00164
        armature.edit_bones["DEF-f_pinky.02.L"].head.x += 0.00164
        armature.edit_bones["DEF-f_pinky.03.L"].head.x += 0.00164
        bpy.context.object.data.use_mirror_x = False

except:
    pass

bpy.ops.object.mode_set(mode='POSE')
bpy.ops.object.expykit_extract_metarig(rig_preset='Rigify_Metarig.py', assign_metarig=True)

## Part 2

# Deselect all objects
bpy.ops.object.mode_set(mode='OBJECT')
bpy.ops.object.select_all(action='DESELECT')

armature = obj.data

for o in bpy.data.objects:
    # Check for given object names
    if o.name in ("metarig", armature.name):
        o.select_set(True)

metarm = bpy.data.objects["metarig"].data

bpy.ops.object.mode_set(mode='EDIT')
for bone in metarm.edit_bones:
    if "f_" in bone.name or "thumb" in bone.name:
        bone.roll =  armature.edit_bones["DEF-"+bone.name].roll

## Fixes the tiddy bones.  Expykit, why did you neglect them
bpy.ops.object.mode_set(mode='EDIT')
armature = bpy.data.objects[obj.name].data

## Left side first, right side's xyz is same as left, but x is negative
def getboob(bone, tip):
    if tip == "head":
        return armature.edit_bones[bone].head.x, armature.edit_bones[bone].head.y, armature.edit_bones[bone].head.z
    else:
        return armature.edit_bones[bone].tail.x, armature.edit_bones[bone].tail.y, armature.edit_bones[bone].tail.z
        
    
try:
    xh, yh, zh = getboob("DEF-breast.L", "head")
    xt, yt, zt = getboob("DEF-breast.L", "tail")

    ## Change the meta arm's boob positions

    def fixboob(bone, xh, yh, zh, xt, yt, zt):
        bone.head.x = xh
        bone.head.y = yh
        bone.head.z = zh
        bone.tail.x = xt
        bone.tail.y = yt
        bone.tail.z = zt

    boobL = metarm.edit_bones["breast.L"]
    fixboob(boobL, xh, yh, zh, xt, yt, zt)
    boobR = metarm.edit_bones["breast.R"]
    fixboob(boobR, -xh, yh, zh, -xt, yt, zt)

    boobL.roll = armature.edit_bones["DEF-breast.L"].roll
    boobR.roll = -boobL.roll
except Exception:
    # If breast bones dont exist in the orig rig, then delete from the meta rig
    metarm.edit_bones.remove(metarm.edit_bones["breast.L"])
    metarm.edit_bones.remove(metarm.edit_bones["breast.R"])
    


##########  DETACH PHYSICS BONES,  

metanames = ['eye.L', 'eye.R', 'spine', 'thigh.L', 'shin.L', 'foot.L', 'toe.L', 'thigh.R', 'shin.R', 'foot.R', 'toe.R', 'spine.001', 'spine.002', 'spine.003', 'breast.L', 'breast.R', 'shoulder.L', 'upper_arm.L', 'forearm.L', 'hand.L', 'thumb.01.L', 'thumb.02.L', 'thumb.03.L', 'f_index.01.L', 'f_index.02.L', 'f_index.03.L', 'f_middle.01.L', 'f_middle.02.L', 'f_middle.03.L', 'f_ring.01.L', 'f_ring.02.L', 'f_ring.03.L', 'f_pinky.01.L', 'f_pinky.02.L', 'f_pinky.03.L', 'spine.004', 'spine.006', 'shoulder.R', 'upper_arm.R', 'forearm.R', 'hand.R', 'thumb.01.R', 'thumb.02.R', 'thumb.03.R', 'f_index.01.R', 'f_index.02.R', 'f_index.03.R', 'f_middle.01.R', 'f_middle.02.R', 'f_middle.03.R', 'f_ring.01.R', 'f_ring.02.R', 'f_ring.03.R', 'f_pinky.01.R', 'f_pinky.02.R', 'f_pinky.03.R']

pre_res = ["DEF-" + bonename for bonename in metanames]
armature = obj.data ## Original char rig


## Make a dictionary.  Key is a main body bone that exists in the Rigify (arm, leg, spine, etc), and the value is a list of all the children bones that aren't other main body bones (usually hair, clothes, deform, etc.)
savethechildren = {
    
}
bpy.ops.object.mode_set(mode='EDIT')
for bone in armature.edit_bones:
    if bone.name in pre_res:
        childlist = []
        for childbone in armature.edit_bones[bone.name].children:
            if childbone.name not in pre_res: # Adds only non-main body bones, avoids like forearm or knee etc
                childlist.append(childbone.name)
        if childlist: # If list isn't empty, add it to dict
            wtf = bone.name
            savethechildren[wtf] = childlist

    
## Selects and separates the physics bones
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.armature.select_all(action='DESELECT')
bones = armature.edit_bones[:]
for bone in bones:
    if bone.name not in pre_res:
        #this is a physics bone, so select it.
        bone.select = True
        bone.select_tail = True
        bone.select_head = True

bpy.ops.armature.separate()
# Generates rigify rig and renames it to 'rigify'
bpy.ops.pose.rigify_generate()
bpy.data.objects[obj.name].name = "rigify"
bpy.context.view_layer.objects.active = bpy.data.objects[armature.name + ".001"]


for o in bpy.data.objects:
    # Check for given object names
    if o.name in ("rigify", armature.name):
        o.select_set(True)
        
# THEN REATTACH PHYSICS

bpy.ops.object.mode_set(mode='OBJECT')
### BLENDER ARE U GOOD LMAO WTF IS THIS (this joins two objects together)
newrig = armature.name + ".001" ## New temporary armature with the physics bones. Hopefully you didnt touch any names lmao

## Why's the list for selected objects ordered alphabetically instead of by selection order
objList = bpy.context.selected_objects
unselected = [obj for obj in objList if obj != context.active_object]
rigifyr = unselected[0]  ## Rigified Rig

obs = [bpy.data.objects[rigifyr.name], bpy.data.objects[newrig]]
c={}
c["object"] =  c["active_object"] = bpy.data.objects[rigifyr.name]
c["selected_objects"] = c["selected_editable_objects"] = obs
bpy.ops.object.mode_set(mode='OBJECT')

with bpy.context.temp_override(active_object=bpy.data.objects[rigifyr.name], selected_editable_objects=obs):
    bpy.ops.object.join()



bpy.context.view_layer.objects.active = bpy.data.objects["rigify"]
bpy.ops.object.mode_set(mode='EDIT')

## Reattach the physics bones to their parents
#Go back into rigify, find the main body bones, and reattach every bone in the corresponding dict list
for mainbone in savethechildren:    
    for childbone in savethechildren[mainbone]:
        rigifyr.data.edit_bones[childbone].parent = rigifyr.data.edit_bones[mainbone]

for x in [".L", ".R"]:
    rigifyr.data.edit_bones["DEF-forearm" + x + ".002"].parent = rigifyr.data.edit_bones["DEF-forearm"+x]
print("donelol\n")
bpy.ops.object.mode_set(mode='OBJECT')
bpy.data.objects["rigify"].show_in_front = True


rigifyr.pose.bones["thigh_parent.L"]["IK_Stretch"] = 0.000
rigifyr.pose.bones["thigh_parent.R"]["IK_Stretch"] = 0.000
rigifyr.pose.bones["upper_arm_parent.L"]["IK_Stretch"] = 0.000
rigifyr.pose.bones["upper_arm_parent.R"]["IK_Stretch"] = 0.000
rigifyr.pose.bones["upper_arm_parent.L"]["FK_limb_follow"] = 1.000
rigifyr.pose.bones["upper_arm_parent.R"]["FK_limb_follow"] = 1.000
rigifyr.pose.bones["torso"]["neck_follow"] = 1.000



fucks = ["upper_arm_ik_target.L", "upper_arm_ik_target.R", "VIS_upper_arm_ik_pole.L", "VIS_upper_arm_ik_pole.R", "thigh_ik_target.L", "thigh_ik_target.R", "VIS_thigh_ik_pole.L", "VIS_thigh_ik_pole.R"]
bpy.ops.object.mode_set(mode='POSE')
for fuck in fucks:
    rigifyr.pose.bones[fuck].driver_remove("hide")
    
    
bpy.ops.object.mode_set(mode='EDIT')
#### Symmetrize clothes/hair bones
eb = rigifyr.data.edit_bones
for bone in eb:
    if "L_" in bone.name: # Finds clothes/hair bones with symmetrical bones
        try:
            y = bone.name.find('L_')  # Finds index of "HairL_1"
            orgname = bone.name
            newname = orgname[:y] + "_" + orgname[y+2:]  # newname = "Hair_1
            oppbone = orgname[:y] + "R_" + orgname[y+2:] # oppbone = "HairR_1"
            bone.name = newname + ".L"    # Renames bone to _L format
            eb[oppbone].name = newname + ".R"   # Renames opposite bone to _R format
            if (round(bone.head[0], 3) == round(-eb[newname+".R"].head[0], 3)): # Not every bone with a symmetrical name is actually *physically* symmetrical. This checks to make sure that they are.
                eb[newname+".R"].roll = -bone.roll   # Symmetrizes rolls
        except:
            pass


# This part puts all the main bones I use into the secoond bone layer
bpy.ops.object.mode_set(mode='OBJECT')
listofbones = ["root", "foot_ik.R", "foot_ik.L", "thigh_ik_target.R", "thigh_ik_target.L", "hips", "torso", "chest", "neck", "head", "eyeRoot", "shoulder.L", "shoulder.R", "upper_arm_fk.L", "upper_arm_fk.R", "forearm_fk.L", "forearm_fk.R", "hand_fk.L", "hand_fk.R", "upper_arm_ik_target.L", "upper_arm_ik_target.R", "hand_ik.R", "hand_ik.L"]


for bone in listofbones:
    try:
        bpy.context.active_object.pose.bones[bone].bone.layers[1] = True
    except:
        pass

# Separates physics-related bones into layers 22 and 23
clothes = ["ribbon", "sleeve", "strap", "skirt", "button", "belt", "cloth"]
hair = ["hair", "eardrop"]

eb = obj.pose.bones
try:
    for bone in eb:
        for name in clothes:
            if name in bone.name.lower():
                obj.pose.bones[bone.name].bone.layers[22] = True
                obj.pose.bones[bone.name].bone.layers[0] = False
        for name in hair:
            if name in bone.name.lower():
                obj.pose.bones[bone.name].bone.layers[23] = True
                obj.pose.bones[bone.name].bone.layers[0] = False
except:
    pass
    
# Change any physics bones attached to shoulder to be attached to spine instead bc it's a pain in the ass to animate
bpy.ops.object.mode_set(mode='EDIT')
bones = rigifyr.data.edit_bones[:]

rigifyr.data.edit_bones.remove(rigifyr.data.edit_bones["palm.L"])
rigifyr.data.edit_bones.remove(rigifyr.data.edit_bones["palm.R"])

# for bone in bones:
    # if bone.parent:
        # if bone.name not in pre_res and bone.parent.name in ["DEF-shoulder.L", "DEF-shoulder.R"]:
            # print(bone)
            
            # bone.parent = rigifyr.data.edit_bones["DEF-spine.003"]

# makes a root #2 bone
newroot = rigifyr.data.edit_bones.new("root_2")
root = rigifyr.data.edit_bones["root"]
newroot.head = root.head.copy()
newroot.tail = root.tail.copy()
newroot.roll = root.roll
newroot.matrix = root.matrix.copy()
newroot.tail.y += 0.5
root.parent = newroot


bpy.ops.object.mode_set(mode='POSE')   
if ver == 4:
    rigifyr.data.collections.new("Main")
    rigifyr.data.collections.new("Clothes")
    rigifyr.data.collections.new("Hair")
    for bone in listofbones:
        try:
            rigifyr.data.collections["Main"].assign(rigifyr.pose.bones[bone])
        except:
            pass
    
    for bone in eb:
        for name in clothes:
            if name in bone.name.lower():
                rigifyr.data.collections["Clothes"].assign(rigifyr.pose.bones[bone.name])
        for name in hair:
            if name in bone.name.lower():
                rigifyr.data.collections["Hair"].assign(rigifyr.pose.bones[bone.name])

    rigifyr.data.collections["Main"].assign(rigifyr.pose.bones["root_2"])
    rigifyr.data.collections["Root"].assign(rigifyr.pose.bones["root_2"])
    collections = rigifyr.data.collections
    len = len(collections)
    for i in range(0, 3):
        collections.active_index = len-1
        for i in range(0, len-1):
            bpy.ops.armature.collection_move(direction='UP')

    

bpy.ops.pose.select_all(action='DESELECT')
bones_list = obj.pose.bones
rigifyr.pose.bones["root_2"].custom_shape = bpy.data.objects["WGT-" + original_name + "_root"]

bpy.ops.pose.select_all(action='DESELECT')
bone = rigifyr.pose.bones["root_2"].bone
rigifyr.data.bones.active = bone
try:
    bpy.ops.pose.group_assign(type=6)
    for x in range(0, 28):
        bone.layers[x] = False
    bone.layers[1] = True
except:
    pass
    
bpy.ops.pose.select_all(action='DESELECT')

### Makes it able to scale only the fingertips by scaling the X axis on the finger scale controls
rig = rigifyr
for oDrv in rig.animation_data.drivers:
    for variable in oDrv.driver.variables:
        for target in variable.targets:
            if ".03" in oDrv.data_path and target.data_path[-7:] == "scale.y":
                target.data_path = target.data_path[:-1] + "x"

fingerlist = ["thumb.01_master", "f_index.01_master", "f_middle.01_master", "f_ring.01_master", "f_pinky.01_master"]
for side in [".L", ".R"]:
    for bone in fingerlist:
        rig.pose.bones[bone + side].lock_scale[0] = False
       
 # Change the body outline and the hair and face outline values match.
def add_driver(source, target, path, dataPath):
    d = source.driver_add( path).driver
    v = d.variables.new()
    d.type = "SCRIPTED"
    v.name                 = "Input_7"
    v.targets[0].id        = target
    v.targets[0].data_path = dataPath 
    d.expression = "Input_7 - .08"
    
try:
    bod = bpy.data.objects["Body"]
    face = bpy.data.objects["Face"]
    hair = bpy.data.objects["Hair"]

    add_driver(face, bod, 'modifiers["Outlines Face"]["Input_7"]', 'modifiers["Outlines Body"]["Input_7"]')
    add_driver(hair, bod, 'modifiers["Outlines Hair"]["Input_7"]', 'modifiers["Outlines Body"]["Input_7"]')
except:
    pass
    
# Puts these into a selection set (you need the addon (well no u dont bc i put this in a try block lmao))
try:
    bpy.ops.pose.select_all(action='DESELECT')
    ## Arms
    arms = ['upper_arm_fk', 'forearm_fk', 'hand_fk', 'shoulder']
    for side in ['.L', '.R']:
        for bone in arms:
            bonename = bone + side
            rigifyr.pose.bones[bonename].bone.select= True
    bpy.ops.pose.selection_set_add()
    bpy.ops.pose.selection_set_assign()
    bpy.ops.pose.select_all(action='DESELECT')    
    bpy.context.object.selection_sets[0].name = "FK Arms"
except:
    pass

bpy.ops.object.mode_set(mode='OBJECT')
## If you want no poles, delete these next few lines before 'face_mask' hide
rigifyr.pose.bones["upper_arm_parent.L"]["pole_parent"] = 1
rigifyr.pose.bones["upper_arm_parent.R"]["pole_parent"] = 1
rigifyr.pose.bones["thigh_parent.L"]["pole_parent"] = 6
rigifyr.pose.bones["thigh_parent.R"]["pole_parent"] = 6
rigifyr.pose.bones["upper_arm_parent.R"]["pole_vector"] = True
rigifyr.pose.bones["upper_arm_parent.L"]["pole_vector"] = True
rigifyr.pose.bones["thigh_parent.L"]["pole_vector"] = True
rigifyr.pose.bones["thigh_parent.R"]["pole_vector"] = True
rigifyr.pose.bones["upper_arm_parent.R"]["IK_FK"] = 1.000
rigifyr.pose.bones["upper_arm_parent.L"]["IK_FK"] = 1.000

try:
    bpy.ops.object.select_all(action='DESELECT')
    bpy.data.objects['Face_Mask'].select_set(True) 
    bpy.ops.object.delete() 
    bpy.ops.object.select_all(action='DESELECT')
except:
    pass

try:
    bpy.data.objects["Weapon"].hide_viewport = True
    bpy.data.objects["Weapon"].hide_render = True
except:
    pass
try:
    bpy.context.view_layer.objects.active = bpy.data.objects["Head Origin"]
    bpy.ops.constraint.childof_set_inverse(constraint="Child Of", owner='OBJECT')
except:
    pass
x = original_name.split("_")
bpy.data.objects["rigify"].users_collection[0].name = x[-2]
bpy.data.objects["rigify"].name = x[-2] + "Rig"

try:
    bpy.context.scene.objects["Head Forward"].hide_viewport = True
    bpy.context.scene.objects["Head Up"].hide_viewport = True
except:
    pass

lis = ["Body", "Face", "Hair"]

for obj in lis:
    try:
        mod = bpy.context.scene.objects[obj].modifiers[2]
        mod.show_viewport = False 
    except:
        pass

bpy.context.view_layer.objects.active = rigifyr
bpy.ops.object.mode_set(mode='POSE')
for b in rigifyr.pose.bones: # so if you move the rig in object mode, the fingers go nuts unless i do this. this is so stupid.
    if "ORG-palm" in b.name:
        b.constraints[0].enabled = False
        b.constraints[0].enabled = True

bpy.ops.pose.reveal()
bpy.ops.object.mode_set(mode='OBJECT')

mat = bpy.context.scene.objects["Face"].data.materials
obj = bpy.context.scene.objects["Face"]

mat[1] = mat[1].copy()
mat[1].blend_method = 'BLEND'

fucks = ["Head Origin", "Head Forward", "Head Up", "Main Light Direction"]
for fuck in fucks:
    bpy.data.objects[fuck].name = x[-2] + " " + bpy.data.objects[fuck].name 

fucks = ["upper_arm_ik_target.L", "upper_arm_ik_target.R", "VIS_upper_arm_ik_pole.L", "VIS_upper_arm_ik_pole.R", "thigh_ik_target.L", "thigh_ik_target.R", "VIS_thigh_ik_pole.L", "VIS_thigh_ik_pole.R"]

for fuck in fucks:
    rigifyr.data.bones[fuck].driver_remove("hide")
   

# These next 5 lines make it so you can scale the FK bones in all 3 axises instead of just 1.
rigifyr = rigifyr.pose.bones
bones = ["MCH-upper_arm_tweak", "MCH-forearm_tweak"]
for side in [".L", ".R"]:
    rigifyr["MCH-forearm_tweak" + side].constraints["Copy Scale"].subtarget = "ORG-forearm" + side

for side in [".L", ".R"]:
    rigifyr["MCH-upper_arm_tweak" + side].constraints["Copy Scale"].subtarget = "ORG-upper_arm" + side


for obj in rig.children:
    obj.name = x[-2] + " " + obj.name


