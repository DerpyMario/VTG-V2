using UnityEngine;
using UnityEditor;
using StageLib;
using System.IO;
using System.Collections.Generic;

public class StageJsonImporter : EditorWindow
{
    private string jsonPath = "";
    private string stageName = "NewStage";
    private string prefabRootPath = "Assets/Prefabs";
    private string bundleRootPath = "Assets/AssetBundles";
    private Vector2 scrollPos;
    private StageData stageData;
    private GameObject stageRoot;
    private bool importSetFile = true;

    [MenuItem("Tools/Stage Json Importer")]
    static void Init()
    {
        var window = GetWindow<StageJsonImporter>();
        window.titleContent = new GUIContent("Stage Importer");
        window.Show();
    }

    void OnGUI()
    {
        EditorGUILayout.BeginVertical();

        EditorGUILayout.BeginHorizontal();
        jsonPath = EditorGUILayout.TextField("JSON File", jsonPath);
        if(GUILayout.Button("Browse", GUILayout.Width(60)))
        {
            jsonPath = EditorUtility.OpenFilePanel("Select Stage JSON", "", "json");
        }
        EditorGUILayout.EndHorizontal();

        importSetFile = EditorGUILayout.Toggle("Import Set File (_e1.json)", importSetFile);
        stageName = EditorGUILayout.TextField("Stage Name", stageName);
        prefabRootPath = EditorGUILayout.TextField("Prefab Root Path", prefabRootPath);
        bundleRootPath = EditorGUILayout.TextField("Bundle Root Path", bundleRootPath);

        if(GUILayout.Button("Load & Create Stage"))
        {
            LoadAndCreateStage();
        }

        DisplayStageInfo();
        EditorGUILayout.EndVertical();
    }

    private void LoadAndCreateStage()
    {
        if(string.IsNullOrEmpty(jsonPath)) return;

        // Load main stage data
        string jsonContent = File.ReadAllText(jsonPath);
        stageData = StageData.LoadByJSONStr(jsonContent);

        // Check for stage set file (_e1.json)
        if(importSetFile)
        {
            string stageSetPath = Path.ChangeExtension(jsonPath, null) + "_e1.json";
            if(File.Exists(stageSetPath))
            {
                string stageSetContent = File.ReadAllText(stageSetPath);
                var stageSetData = StageData.LoadByJSONStr(stageSetContent);

                // Merge stage set data with main stage data
                if(stageSetData != null && stageSetData.Datas != null)
                {
                    stageData.Datas.AddRange(stageSetData.Datas);
                }
            }
        }

        // Get stage name from file name without extensions
        stageName = Path.GetFileNameWithoutExtension(jsonPath);
        stageName = stageName.Replace("_e1", ""); // Remove _e1 suffix if present

        CreateStageHierarchy();
    }

    private void CreateStageHierarchy()
    {
        stageRoot = new GameObject(stageName);
        
        int groupIndex = 0;
        foreach(var groupData in stageData.Datas)
        {
            GameObject groupObj = new GameObject($"Group_{groupIndex++}_{groupData.fClipMinx:F2}_{groupData.fClipMaxx:F2}");
            groupObj.transform.SetParent(stageRoot.transform);

            foreach(var objData in groupData.Datas)
            {
                CreateStageObject(objData, groupObj.transform);
            }
        }

        Selection.activeGameObject = stageRoot;
        EditorUtility.SetDirty(stageRoot);
    }

    private void CreateStageObject(StageObjData objData, Transform parent)
    {
        GameObject prefab = LoadPrefabFromPaths(objData);
        GameObject obj = prefab != null ? PrefabUtility.InstantiatePrefab(prefab) as GameObject : new GameObject(objData.name);
        
        obj.transform.SetParent(parent);
        obj.name = objData.name;
        obj.transform.localPosition = objData.position;
        obj.transform.localRotation = objData.rotate;
        obj.transform.localScale = objData.scale;

        ProcessObjectProperties(obj, objData);
    }

    private GameObject LoadPrefabFromPaths(StageObjData objData)
    {
        List<string> searchPaths = new List<string>();

        // Add prefab paths
        if(!string.IsNullOrEmpty(objData.path))
        {
            searchPaths.Add(objData.path);
            searchPaths.Add(Path.Combine(prefabRootPath, objData.path));
            searchPaths.Add(Path.Combine("Assets/Resources", objData.path));
        }

        // Add bundle paths 
        if(!string.IsNullOrEmpty(objData.bunldepath))
        {
            searchPaths.Add(Path.Combine(bundleRootPath, objData.bunldepath));
            searchPaths.Add(Path.Combine("Assets/Bundle", objData.bunldepath));
            searchPaths.Add(Path.Combine("Assets/AssetBundles", objData.bunldepath));
            searchPaths.Add(Path.Combine("Assets/StreamingAssets", objData.bunldepath));
            
            // Bundle variants
            searchPaths.Add(objData.bunldepath + ".unity3d");
            searchPaths.Add(objData.bunldepath + ".assetbundle");
        }

        foreach(string path in searchPaths)
        {
            string assetPath = path;
            if(!assetPath.EndsWith(".prefab") && !assetPath.EndsWith(".unity3d") && !assetPath.EndsWith(".assetbundle"))
            {
                assetPath += ".prefab";
            }

            GameObject prefab = AssetDatabase.LoadAssetAtPath<GameObject>(assetPath);
            if(prefab != null)
            {
                Debug.Log($"Found asset at path: {assetPath}");
                return prefab;
            }
        }

        Debug.Log($"No prefab found for {objData.name} at any path");
        return null;
    }

    private void ProcessObjectProperties(GameObject obj, StageObjData objData)
    {
        if(string.IsNullOrEmpty(objData.property)) return;

        string[] props = objData.property.Split(',');
        if(props.Length == 0) return;

        if(!int.TryParse(props[0], out int typeId)) return;

        StageObjType objType = (StageObjType)typeId;
        AddStageComponent(obj, objType, objData);

        var objIniter = obj.GetComponent<StageObjIniter>() ?? obj.AddComponent<StageObjIniter>();
        objIniter.sPrefabPath = objData.path;
        objIniter.sImagePath = objData.bunldepath;
    }

    private void AddStageComponent(GameObject obj, StageObjType type, StageObjData data)
    {
        StageSLBase component = null;

        switch(type)
        {
            case StageObjType.START_OBJ:
                component = obj.AddComponent<StageStartPoint>();
                break;
            case StageObjType.PREFAB_OBJ:
                component = obj.AddComponent<EventPointBase>();
                break;	
            case StageObjType.END_OBJ:
                component = obj.AddComponent<StageEndPoint>();
                break;				
            case StageObjType.MAPEVENT_OBJ:
                component = obj.AddComponent<MapObjEvent>();
                break;
            case StageObjType.ENEMYEP_OBJ:
                component = obj.AddComponent<EnemyEventPoint>();
                break;
            case StageObjType.DEADAREA_OBJ:
                component = obj.AddComponent<DeadAreaEvent>();
                break;
            case StageObjType.STAGECOLLISION_OBJ:
                component = obj.AddComponent<MapCollisionEvent>();
                break;				
            case StageObjType.RIDEABLE_OBJ:
                component = obj.AddComponent<StageRideableObj>();
                break;
            case StageObjType.STAGEREBORN_OBJ:
                component = obj.AddComponent<StageRebounEvent>();
                break;
            case StageObjType.STAGEONEWORK_OBJ:
                component = obj.AddComponent<StageOneWorkEvent>();
                break;				
            case StageObjType.PATROLPATH_OBJ:
                component = obj.AddComponent<StagePatrolPath>();
                break;
			case StageObjType.DATAPOING_OBJ:
                component = obj.AddComponent<StageDataPoint>();
                break;
            case StageObjType.LOCK_RANGE_OBJ:
                component = obj.AddComponent<LockRangeEvent>();
                break;
            case StageObjType.BLOCKWALL_OBJ:
                component = obj.AddComponent<StageBlockWall>();
                break;
            case StageObjType.STAGECTRL_OBJ:
                component = obj.AddComponent<StageCtrlEvent>();
                break;
            case StageObjType.ENEMY_OBJ:
                component = obj.AddComponent<StageEnemy>();
                break;	
        }

        if(component != null)
        {
            component.LoadByString(data.property);
        }
    }

    private void DisplayStageInfo()
    {
        if(stageData == null) return;

        scrollPos = EditorGUILayout.BeginScrollView(scrollPos);
        EditorGUILayout.LabelField("Stage Data", EditorStyles.boldLabel);
        EditorGUILayout.LabelField($"Version: {stageData.nVer}");
        EditorGUILayout.LabelField($"Clip Width: {stageData.fStageClipWidth}");
        EditorGUILayout.LabelField($"Groups: {stageData.Datas.Count}");
        EditorGUILayout.EndScrollView();
    }
}
