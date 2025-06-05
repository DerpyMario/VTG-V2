#Noesis Python model import+export test module, imports/exports some data from/to a made-up format

from inc_noesis import *

import noesis

import struct

#rapi methods should only be used during handler callbacks
import rapi

#registerNoesisTypes is called by Noesis to allow the script to register formats.
#Do not implement this function in script files unless you want them to be dedicated format modules!
def registerNoesisTypes():
    handle = noesis.register("Dolphin Wave", ".bum")
    noesis.setHandlerTypeCheck(handle, noepyCheckType)
    try: 
        noesis.setHandlerLoadModel(handle, noepyLoadModel) #see also noepyLoadModelRPG
    except Exception as e:
        print(str(e))
        #noesis.setHandlerWriteModel(handle, noepyWriteModel)
        #noesis.setHandlerWriteAnim(handle, noepyWriteAnim)
    #noesis.logPopup()
        #print("The log can be useful for catching debug prints from preview loads.\nBut don't leave it on when you release your script, or it will probably annoy people.")
    return 1

NOEPY_HEADER = "BUM2"
NOEPY_MODELTAG = "MODL"

#check if it's this type based on the data
def noepyCheckType(data):
    bs = NoeBitStream(data)
    if len(data) < 4:
        return 0
    if readTag(bs) != NOEPY_HEADER:
        return 0
    bs.seek(8, NOESEEK_REL)
    headerSize = getSize(bs)
    bs.seek(headerSize, NOESEEK_REL)
    if readTag(bs) != NOEPY_MODELTAG:
        return 0
    return 1

def readTag(bs):
    try:
        tag = noeStrFromBytes(bs.readBytes(4), "ASCII")
    except:
        tag = ""
    return tag

def getSize(bs):
    return bs.readUInt() - 8   # subtract 8 because size includes 4 byte tag + 4 byte size value

def printMatrix(colCount, rowCount, matrix):
    for i in range(0, rowCount):
        row = ""
        for j in range(0, colCount):
            if str(round(matrix[j][i], 2))[0] != '-':
                row += "\t " + str(round(matrix[j][i], 2))
            else:
                row += "\t" + str(round(matrix[j][i], 2))
        print(row)

class bumModel:
    def __init__(self, bs):
        self.textureList = []
        self.vertexList = []
        self.materialList = []
        self.boneList = []
        self.boneMap = []
        self.meshes = []
        self.load(bs)

    # List of file tags
    #  - BUM2   - file header
    #     - VER. (yes, with the period)
    #  - MODL   - file contents
    #     - NODE
    #        - NAME   - node name (string)
    #        - NDAT   - node data (id, parent id, some other stuff that I haven't figured out yet)
    #        - SKDB   - bone data (4x4 matrix)
    #  - MATR   -  material (ask Dahni about this section later)
    #     - NAME   - material name (string)
    #     - SNAM   - shader name
    #     - SAMP   - sampler
    #        - NAME   - sampler name (string)
    #        - SAPR   - value, not sure for what or how to interpret
    #        - TXFM   - texture file name (string)
    #     - RNST   - ?
    #     - RPAS   - ?
    #        - UNIF   - Idk what exactly it's supposed to stand for, but it's basically one field that's related to processing of the texture in relation to the shaders
    #           - NAME   - name
    #           - UVAL   - value
    #  - MESH   - mesh (obviously)
    #     - MESP   - mesh index data (self, parent)
    #     - VERT   - list of vertex data with 3d coords, weight values(?), normals, & UVs
    #     - AABB   - axis-aligned bounding box (thanks Dahni!!!!), used for rough collision detection calculations
    #     - DRWA   - list of vertex indices to make tris
    #     - SBID   - Idk what the SB is, but it looks like a list of IDs, 0-based
    #  - DBPL   - ? DB = database maybe???  Looks a lot like the list of vertex indices and has its own AABB tag

    def load(self, bs):
        bs.seek(4, NOESEEK_REL) #skip past BUM2 tag
        fileEnd = bs.readUInt()
        bs.seek(4, NOESEEK_REL)    #skip VER. tag
        headerSize = getSize(bs)
        bs.seek(headerSize + 4, NOESEEK_REL)    # +4 to also skip past MODL tag
        modelSize = bs.readUInt()

        while bs.tell() < fileEnd:
            tag = readTag(bs)
            size = getSize(bs)
            base = bs.tell()
            
            if tag == "NODE":
                self.readNode(bs, base + size)
            elif tag == "MATR":
                if(len(self.boneList)):
                    rapi.rpgSetBoneMap(self.boneMap)
                # self.readMaterial(bs)
                bs.seek(size, NOESEEK_REL) # until we figure out this part
            elif tag == "MESH":
                self.readMesh(bs)
            elif tag == "SBID":
                bs.seek(size, NOESEEK_REL) # until we figure out this part, if that's necessary
            else:
                # print("going to end of file")
                bs.seek(fileEnd, NOESEEK_ABS)

    def readNode(self, bs, end):
        name = ""
        nodeIndex = -99
        nodeParentIndex = -99
        nodeTranslation = NoeVec3
        nodeScale = NoeVec3
        nodeRotation = NoeQuat
        boneMatrix = NoeMat43
        while bs.tell() < end:
            tag = readTag(bs)
            if tag == "NAME":
                size = getSize(bs)
                name = noeStrFromBytes(bs.readBytes(size), "ASCII")
            elif tag == "NDAT":
                size = getSize(bs)
                base = bs.tell()
                nodeIndex = bs.readInt()
                nodeParentIndex = bs.readInt()

                # TODO:  I have no idea what to do with the nodes rn, will figure out later
                #        I don't think these should be interpreted as bones, but as attach points.

                # nodeTranslation = NoeVec3.fromBytes(bs.readBytes(12))   #idk if this is right, we'll try and see what happens
                # nodeScale = NoeVec3.fromBytes(bs.readBytes(12))
                # nodeRotation = NoeQuat.fromBytes(bs.readBytes(16))

            elif tag == "SKDB":
                size = getSize(bs)
                Mat44 = NoeMat44.fromBytes(bs.readBytes(size))
                boneMatrix = Mat44.toMat43().inverse()
                self.boneMap.append(len(self.boneList))
                
                self.boneList.append(NoeBone(len(self.boneList), name, boneMatrix, None, nodeParentIndex))
            else:
                pass

    # def readMaterial(self, bs):
        

    def readMesh(self, bs):
        bs.seek(4, NOESEEK_REL) # skip NAME tag
        nameSize = getSize(bs)
        name = noeStrFromBytes(bs.readBytes(nameSize), "ASCII")
        rapi.rpgSetName(name)   # for some reason THIS is the function that makes it so each submesh stays as its own submesh
        bs.seek(8, NOESEEK_REL) # skip MESP tag & size, since we know it's gonna be 8
        meshParentIndex = bs.readInt()   # don't ask me why these are swapped in order from the nodes, idk
        meshIndex = bs.readInt()

        self.readVerts(bs, bs.tell())

        # AABB is a bounding box definition, not relevant for now
        if(readTag(bs) != "AABB"):
            bs.seek(4, NOESEEK_REL) # skip the tag
        aabbSize = getSize(bs)

        bs.seek(aabbSize, NOESEEK_REL)

        self.defineTris(bs, bs.tell())

        rapi.rpgClearBufferBinds()



    def readVerts(self, bs, base):
        bs.seek(4, NOESEEK_REL) # skip past VERT tag
        vertEnd = bs.readUInt()
        vertCount = bs.readUInt()
        vertSize = bs.readUShort()

        #in order, the bits in this array represent true/false for the presence of the following data:
        #   0 - position
        #   1 - normals
        #   2 - UV coords
        #   3 - end buffer
        #   4 - tangent vector 1
        #   5 - tangent vector 2
        #   6 - bone indices
        #   7 - bone weights
        #   8 - UV2 coords

        vertFlags = []
        for i in range(16):
            vertFlags.append(bs.readBits(1))

        positionBuffer = bytearray()
        boneIndexBuffer = bytearray()
        boneWeightBuffer = bytearray()
        normalBuffer = bytearray()
        uv1Buffer = bytearray()
        uv2Buffer = bytearray()
        tangentBuffer = bytearray()
        convertedWeightBuffer = bytearray()

        for i in range(0, vertCount):
            # positions, normals, and UVs are bits 0, 1, and 2 in vert flags
            if bool(vertFlags[0]):      # positions
                positionBuffer += bs.readBytes(12)
            if bool(vertFlags[6]):
                boneIndexBuffer += bs.readBytes(4)
            if bool(vertFlags[7]):
                weights = list(bs.readBytes(4))
                weights = [w / 255.0 for w in weights]
                total = sum(weights)
                if total == 0:
                    weights = [1.0, 0.0, 0.0, 0.0]
                else:
                    weights = [w / total for w in weights]
                for w in weights:
                    convertedWeightBuffer += struct.pack("f", w)
            if bool(vertFlags[1]):      # normals
                normalBuffer += bs.readBytes(12)
            if bool(vertFlags[2]):      # main texture coords
                uv1Buffer += bs.readBytes(8)
            if bool(vertFlags[8]):      # secondary texture coords (for AO, etc)
                uv2Buffer += bs.readBytes(8)
            if bool(vertFlags[3]):      # end buffer
                bs.seek(4, NOESEEK_REL)
            if bool(vertFlags[4]):      # tangent vector 1
                tangentBuffer += bs.readBytes(12)
            if bool(vertFlags[5]):      # tangent vector 2
                tangentBuffer += bs.readBytes(12)

        if bool(vertFlags[0]):
            rapi.rpgBindPositionBufferOfs(positionBuffer, noesis.RPGEODATA_FLOAT, 12, 0)
        if bool(vertFlags[1]):
            rapi.rpgBindNormalBufferOfs(normalBuffer, noesis.RPGEODATA_FLOAT, 12, 0)
        if bool(vertFlags[2]):
            rapi.rpgBindUV1BufferOfs(uv1Buffer, noesis.RPGEODATA_FLOAT, 8, 0)
        if bool(vertFlags[8]):
            rapi.rpgBindUV2BufferOfs(uv2Buffer, noesis.RPGEODATA_FLOAT, 8, 0)
        if bool(vertFlags[6]):
            rapi.rpgBindBoneIndexBufferOfs(boneIndexBuffer, noesis.RPGEODATA_BYTE, 4, 0, 4)
        if bool(vertFlags[7]):
            rapi.rpgBindBoneWeightBufferOfs(convertedWeightBuffer, noesis.RPGEODATA_FLOAT, 16, 0, 4)


    def defineTris(self, bs, base):
        bs.seek(4, NOESEEK_REL) # skip DRWA tag
        drwaSize = bs.readUInt()
        end = base + drwaSize
        vertsPerFace = bs.readUInt()
        vertArraySize = bs.readUInt()
        # number of faces = vertArraySize / vertsPerFace
        indicesBuffer = bs.readBytes(vertArraySize * 2)  # x2 because each vert is two bytes

        if bs.tell() != end:
            bs.seek(end, NOESEEK_ABS)
        
        rapi.rpgCommitTriangles(indicesBuffer, noesis.RPGEODATA_USHORT, vertArraySize, noesis.RPGEO_TRIANGLE, 1)


#load the model
def noepyLoadModel(data, mdlList):
    rapi.rpgCreateContext()
    bum = bumModel(NoeBitStream(data))    
    try:
        mdl = rapi.rpgConstructModel()
        mdl.setBones(bum.boneList)
    except:
        noesis.doException('Model has no mesh data! Unable to render.')
    mdlList.append(mdl)
    rapi.rpgClearBufferBinds()
    return 1



