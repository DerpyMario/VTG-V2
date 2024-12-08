using UnityEngine;
using UnityEngine.Scripting;
using UnityEditor;
using UnityEditor.SceneManagement;
using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using StageLib;

public class StageLibDataEditor : EditorWindow
{
    private StageData currentStageData;
    private string jsonFilePath;
    private List<string> selectedStageSets = new List<string>();
    private Vector2 scrollPosition;
    private string prefabRootPath = "Assets/_Main/Prefabs";
    private string bundleRootPath = "Assets/_Main/AssetBundles";

    [MenuItem("StageLib/Stage Data Editor")]
    private static void ShowWindow()
    {
        var window = GetWindow<StageLibDataEditor>();
        window.titleContent = new GUIContent("Stage Data Editor");
        window.Show();
    }

    private void OnGUI()
    {
        scrollPosition = EditorGUILayout.BeginScrollView(scrollPosition);
        DrawToolbar();
        DrawStageBrowser();
        DrawStageDataEditor();
        EditorGUILayout.EndScrollView();
    }

    private void DrawToolbar()
    {
        EditorGUILayout.BeginHorizontal(EditorStyles.toolbar);
        
        if (GUILayout.Button("Clear Scene", EditorStyles.toolbarButton))
        {
            ClearCurrentScene();
        }
        
        EditorGUILayout.EndHorizontal();
    }

    private void DrawStageBrowser()
    {
        EditorGUILayout.Space();
        EditorGUILayout.BeginVertical(EditorStyles.helpBox);
        
        EditorGUILayout.LabelField("Stage Browser", EditorStyles.boldLabel);
        if (GUILayout.Button("Browse Stage Files"))
        {
            LoadMainStageFile();
        }

        if (currentStageData != null)
        {
            EditorGUILayout.Space();
            EditorGUILayout.LabelField("Stage Set Files", EditorStyles.boldLabel);
            DrawStageSetList();
            
            if (selectedStageSets.Count > 0)
            {
                if (GUILayout.Button("Load and Merge Selected Sets"))
                {
                    LoadAndMergeSelectedSets();
                    RestoreSceneFromJson();
                }
            }
        }
        
        EditorGUILayout.EndVertical();
    }

    private void DrawStageSetList()
    {
        string directory = Path.GetDirectoryName(jsonFilePath);
        string fileNameWithoutExt = Path.GetFileNameWithoutExtension(jsonFilePath);
        
        int eIndex = fileNameWithoutExt.LastIndexOf("_e");
        if (eIndex != -1)
        {
            fileNameWithoutExt = fileNameWithoutExt.Substring(0, eIndex);
        }

        string[] stageSetFiles = Directory.GetFiles(directory, fileNameWithoutExt + "_e*.json");
        
        EditorGUILayout.BeginVertical();
        foreach (string filePath in stageSetFiles)
        {
            EditorGUILayout.BeginHorizontal();
            bool isSelected = GUILayout.Toggle(selectedStageSets.Contains(filePath), Path.GetFileName(filePath));
            
            if (isSelected && !selectedStageSets.Contains(filePath))
            {
                selectedStageSets.Add(filePath);
            }
            else if (!isSelected && selectedStageSets.Contains(filePath))
            {
                selectedStageSets.Remove(filePath);
            }
            EditorGUILayout.EndHorizontal();
        }
        EditorGUILayout.EndVertical();
    }

    private void DrawStageDataEditor()
    {
        if (currentStageData == null) return;

        EditorGUILayout.Space();
        EditorGUILayout.LabelField("Stage Data", EditorStyles.boldLabel);
        
        for (int i = 0; i < currentStageData.Datas.Count; i++)
        {
            EditorGUILayout.BeginVertical(EditorStyles.helpBox);
            DrawStageGroupData(currentStageData.Datas[i], i);
            EditorGUILayout.EndVertical();
        }
    }

    private void DrawStageGroupData(StageGroupData groupData, int index)
    {
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField($"Group {index} - {groupData.sGroupID}", EditorStyles.boldLabel);
        EditorGUILayout.EndHorizontal();

        foreach (var objData in groupData.Datas)
        {
            DrawStageObjectData(objData);
        }
    }

    private void DrawStageObjectData(StageObjData objData)
    {
        EditorGUILayout.BeginHorizontal(EditorStyles.helpBox);
        EditorGUILayout.LabelField(objData.name);
        
        if (GUILayout.Button("Edit Properties", GUILayout.Width(100)))
        {
            EditObjectProperties(objData);
        }
        
        EditorGUILayout.EndHorizontal();
    }

    private void LoadMainStageFile()
    {
        string path = EditorUtility.OpenFilePanel("Load Stage JSON", "", "json");
        if (!string.IsNullOrEmpty(path))
        {
            jsonFilePath = path;
            string jsonText = File.ReadAllText(path);
            currentStageData = StageData.LoadByJSONStr(jsonText);
            selectedStageSets.Clear();
        }
    }

    private void MergeStageData(StageData setData)
    {
        foreach (var setGroup in setData.Datas)
        {
            foreach (var setObj in setGroup.Datas)
            {
                var matchingGroup = currentStageData.Datas.Find(g => g.Datas.Exists(o => o.name == setObj.name));
                if (matchingGroup != null)
                {
                    var matchingObj = matchingGroup.Datas.Find(o => o.name == setObj.name);
                    if (matchingObj != null)
                    {
                        matchingObj.property = setObj.property;
                    }
                }
                else
                {
                    var newGroup = currentStageData.Datas.Find(g => g.sGroupID == setGroup.sGroupID);
                    if (newGroup == null)
                    {
                        newGroup = new StageGroupData { sGroupID = setGroup.sGroupID };
                        currentStageData.Datas.Add(newGroup);
                    }
                    newGroup.Datas.Add(setObj);
                }
            }
        }
    }

    private void LoadAndMergeSelectedSets()
    {
        foreach (string setPath in selectedStageSets)
        {
            string jsonText = File.ReadAllText(setPath);
            StageData setData = StageData.LoadByJSONStr(jsonText);
            MergeStageData(setData);
        }
    }

    private void ClearCurrentScene()
    {
        var allObjects = Object.FindObjectsOfType<GameObject>();
        foreach (var obj in allObjects)
        {
            if (obj.transform.parent == null)
            {
                DestroyImmediate(obj);
            }
        }
    }

    private void RestoreSceneFromJson()
    {
        ClearCurrentScene();
        CreateStageHierarchy();
        LoadLightingData();
        EditorSceneManager.MarkSceneDirty(EditorSceneManager.GetActiveScene());
    }

    private void CreateStageHierarchy()
    {
        GameObject stageRoot = new GameObject("StageRoot");
        stageRoot.AddComponent<StageGroupRoot>();

        foreach (StageGroupData groupData in currentStageData.Datas)
        {
            GameObject groupObj = new GameObject(groupData.sGroupID);
            groupObj.AddComponent<StageGroupRoot>().SetSGroupID(groupData.sGroupID);
            groupObj.transform.SetParent(stageRoot.transform);

            foreach (StageObjData objData in groupData.Datas)
            {
                CreateStageObject(objData, groupObj.transform);
            }
        }
    }

    private void CreateStageObject(StageObjData objData, Transform parent)
    {
        GameObject prefab = LoadPrefabFromPaths(objData);
        GameObject instance = prefab != null ? 
            PrefabUtility.InstantiatePrefab(prefab) as GameObject : 
            new GameObject(objData.name);

        instance.name = objData.name;
        instance.transform.SetParent(parent);
        instance.transform.position = objData.position;
        instance.transform.rotation = objData.rotate;
        instance.transform.localScale = objData.scale;

        if (!string.IsNullOrEmpty(objData.property))
        {
            RestoreComponentProperties(instance, objData.property);
        }
    }

    private GameObject LoadPrefabFromPaths(StageObjData objData)
    {
        List<string> searchPaths = new List<string>
        {
            objData.path,
            Path.Combine(prefabRootPath, objData.path),
            Path.Combine("Assets/Resources", objData.path),
            Path.Combine(bundleRootPath, objData.bunldepath),
            Path.Combine("Assets/Bundle", objData.bunldepath),
            Path.Combine("Assets/AssetBundles", objData.bunldepath)
        };

        foreach (string path in searchPaths)
        {
            if (string.IsNullOrEmpty(path)) continue;
            
            string assetPath = path.EndsWith(".prefab") ? path : path + ".prefab";
            GameObject prefab = AssetDatabase.LoadAssetAtPath<GameObject>(assetPath);
            if (prefab != null) return prefab;
        }

        return null;
    }

    private void LoadLightingData()
    {
        string stageName = Path.GetFileNameWithoutExtension(jsonFilePath);
        int eIndex = stageName.LastIndexOf("_e");
        if (eIndex != -1)
        {
            stageName = stageName.Substring(0, eIndex);
        }

        string lightmapPath = $"Assets/rockmanunity/stagelightmap/{stageName}/lightmaplist.json";
        TextAsset lightmapList = AssetDatabase.LoadAssetAtPath<TextAsset>(lightmapPath);
        
        if (lightmapList != null)
        {
            StageLightMapJson lightMapData = JsonUtility.FromJson<StageLightMapJson>(lightmapList.text);
            LoadLightmaps(lightMapData, stageName);
        }
    }

    private void LoadLightmaps(StageLightMapJson lightMapData, string stageName)
    {
        List<LightmapData> lightmaps = new List<LightmapData>();

        foreach (string lightmapName in lightMapData.Datas)
        {
            if (!lightmapName.Contains("Lightmap-")) continue;

            string basePath = $"Assets/rockmanunity/stagelightmap/{stageName}/{lightmapName}";
            LightmapData data = new LightmapData();

            if (lightmapName.Contains("_comp_light"))
            {
                data.lightmapColor = AssetDatabase.LoadAssetAtPath<Texture2D>(basePath);
            }
            else if (lightmapName.Contains("_comp_dir"))
            {
                data.lightmapDir = AssetDatabase.LoadAssetAtPath<Texture2D>(basePath);
            }

            if (data.lightmapColor != null || data.lightmapDir != null)
            {
                lightmaps.Add(data);
            }
        }

        LightmapSettings.lightmaps = lightmaps.ToArray();
    }

    private void EditObjectProperties(StageObjData objData)
    {
        var propertyWindow = EditorWindow.GetWindow<StagePropertyEditorWindow>();
        propertyWindow.titleContent = new GUIContent($"Edit {objData.name}");
        propertyWindow.SetObjectData(objData, OnPropertyChanged);
        propertyWindow.Show();
    }
}

public class StagePropertyEditorWindow : EditorWindow
{
    private StageObjData objData;
    private System.Action<StageObjData> onPropertyChanged;
    private Vector2 scrollPosition;
    private Editor componentEditor;

    public void SetObjectData(StageObjData data, System.Action<StageObjData> callback)
    {
        objData = data;
        onPropertyChanged = callback;
        CreateTempComponent();
    }

    private void CreateTempComponent()
    {
        string[] propertyParts = objData.property.Split(new char[] { ',' }, 2);
        if (propertyParts.Length < 1) return;

        if (int.TryParse(propertyParts[0], out int objType))
        {
            GameObject tempObj = new GameObject("TempEditor");
            Component component = null;

            switch ((StageObjType)objType)
            {
                case StageObjType.PREFAB_OBJ:
                    component = tempObj.AddComponent<StageSceneObjParam>();
                    break;
                case StageObjType.ENEMY_OBJ:
                    component = tempObj.AddComponent<StageEnemy>();
                    break;
                case StageObjType.ENEMYEP_OBJ:
                    component = tempObj.AddComponent<EnemyEventPoint>();
                    break;
                case StageObjType.START_OBJ:
                    component = tempObj.AddComponent<StageStartPoint>();
                    break;
                case StageObjType.END_OBJ:
                    component = tempObj.AddComponent<StageEndPoint>();
                    break;
                case StageObjType.BLOCKWALL_OBJ:
                    tempObj.AddComponent<BoxCollider2D>();
                    component = tempObj.AddComponent<StageBlockWall>();
                    break;
                case StageObjType.MAPEVENT_OBJ:
                    component = tempObj.AddComponent<MapObjEvent>();
                    break;
                case StageObjType.DEADAREA_OBJ:
                    component = tempObj.AddComponent<DeadAreaEvent>();
                    break;
                case StageObjType.LOCK_RANGE_OBJ:
                    component = tempObj.AddComponent<LockRangeEvent>();
                    break;
                case StageObjType.STAGECTRL_OBJ:
                    component = tempObj.AddComponent<StageCtrlEvent>();
                    break;
                case StageObjType.PATROLPATH_OBJ:
                    component = tempObj.AddComponent<StagePatrolPath>();
                    break;
                case StageObjType.DATAPOING_OBJ:
                    component = tempObj.AddComponent<StageDataPoint>();
                    break;
                case StageObjType.RIDEABLE_OBJ:
                    component = tempObj.AddComponent<StageRideableObj>();
                    break;
                case StageObjType.STAGEREBORN_OBJ:
                    component = tempObj.AddComponent<StageRebounEvent>();
                    break;
                case StageObjType.STAGEONEWORK_OBJ:
                    component = tempObj.AddComponent<StageOneWorkEvent>();
                    break;
                case StageObjType.STAGECOLLISION_OBJ:
                    component = tempObj.AddComponent<MapCollisionEvent>();
                    break;
            }

            if (component != null && propertyParts.Length > 1)
            {
                if (component is StageSLBase slBase)
                {
                    slBase.LoadByString(propertyParts[1]);
                }
                componentEditor = Editor.CreateEditor(component);
            }
        }
    }

    private void OnGUI()
    {
        if (componentEditor == null) return;

        scrollPosition = EditorGUILayout.BeginScrollView(scrollPosition);
        
        EditorGUI.BeginChangeCheck();
        componentEditor.OnInspectorGUI();
        
        if (EditorGUI.EndChangeCheck())
        {
            if (componentEditor.target is StageSLBase slBase)
            {
                string newProperty = $"{(int)GetObjectType(componentEditor.target)},{slBase.GetSaveString()}";
                objData.property = newProperty;
                onPropertyChanged?.Invoke(objData);
            }
        }

        EditorGUILayout.EndScrollView();
    }

    private void OnDestroy()
    {
        if (componentEditor != null)
        {
            DestroyImmediate(componentEditor.target);
            DestroyImmediate(componentEditor);
        }
    }

    private StageObjType GetObjectType(Object component)
    {
        if (component is StageEnemy) return StageObjType.ENEMY_OBJ;
        if (component is EnemyEventPoint) return StageObjType.ENEMYEP_OBJ;
        if (component is StageStartPoint) return StageObjType.START_OBJ;
        if (component is StageEndPoint) return StageObjType.END_OBJ;
        if (component is StageBlockWall) return StageObjType.BLOCKWALL_OBJ;
        if (component is MapObjEvent) return StageObjType.MAPEVENT_OBJ;
        if (component is DeadAreaEvent) return StageObjType.DEADAREA_OBJ;
        if (component is LockRangeEvent) return StageObjType.LOCK_RANGE_OBJ;
        if (component is StageCtrlEvent) return StageObjType.STAGECTRL_OBJ;
        if (component is StagePatrolPath) return StageObjType.PATROLPATH_OBJ;
        if (component is StageDataPoint) return StageObjType.DATAPOING_OBJ;
        if (component is StageRideableObj) return StageObjType.RIDEABLE_OBJ;
        if (component is StageRebounEvent) return StageObjType.STAGEREBORN_OBJ;
        if (component is StageOneWorkEvent) return StageObjType.STAGEONEWORK_OBJ;
        if (component is MapCollisionEvent) return StageObjType.STAGECOLLISION_OBJ;
        return StageObjType.PREFAB_OBJ;
    }
}

