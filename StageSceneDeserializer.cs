using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using StageLib;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEditor;
using UnityEditor.SceneManagement;

public class StageSceneDeserializer : MonoBehaviour
{
    [Header("Stage Data Settings")]
    public TextAsset stageDataJsonFile;
    [SerializeField] private string outputScenePath = "Assets/Scenes/DeserializedStage.unity";
    
    [Header("Asset Search Paths")]
    [SerializeField] private string[] assetSearchPaths = new string[] {
        "Assets/Prefabs",
        "Assets/Resources",
        "Assets/AssetBundles"
    };
    [SerializeField] private bool searchAllAssets = true;
    
    [Header("Multi-File Import")]
    [SerializeField] private bool enableMultiFileImport = true;
    [SerializeField] private string baseFilePath = "";
    [SerializeField] private List<TextAsset> additionalStageDataFiles = new List<TextAsset>();
    [SerializeField] private bool autoDetectRelatedFiles = true;
	
	[Header("Extension Files")]
    [SerializeField] private bool createSeparateRootForExtensions = true;
    [SerializeField] private string extensionRootName = "StageEx";
	
	[Header("Group Naming")]
    [SerializeField] private bool useGroupIdsForNames = true;
    [SerializeField] private bool appendGroupIndex = true;
   
    [Header("Debug")]
    [SerializeField] private bool logDebugInfo = true;
    [SerializeField] private bool createEmptyPrefabsForMissing = true;

    private StageData stageData;
    private StageData baseStageData;
    private List<StageData> extensionStageData = new List<StageData>();
    private Dictionary<string, GameObject> prefabCache = new Dictionary<string, GameObject>();
    private Dictionary<int, GameObject> gameObjectsByTypeId = new Dictionary<int, GameObject>();
    private Dictionary<string, Transform> groupRoots = new Dictionary<string, Transform>();
    private int objectCounter = 0;

    [ContextMenu("Deserialize Stage Data")]
    public void DeserializeStageData()
    {
        if (stageDataJsonFile == null)
        {
            Debug.LogError("No stage data JSON file assigned!");
            return;
        }

        // Auto-detect related files if enabled
        if (autoDetectRelatedFiles && enableMultiFileImport)
        {
            ImportAndMergeRelatedFiles();
        }

        // Load the base stage data
        LoadStageData();
        
        // Load and merge additional stage data if enabled
        if (enableMultiFileImport && additionalStageDataFiles.Count > 0)
        {
            MergeAdditionalStageData();
        }
        
        // Create the scene with the merged data
        CreateScene();
    }

    // Modify the LoadStageData method to store base data separately
    private void LoadStageData()
    {
        try
        {
            string jsonText = stageDataJsonFile.text;
            
            // Check if the data is encoded
            if (!jsonText.StartsWith("{"))
            {
                baseStageData = StageData.LoadByJSONStr(jsonText);
                stageData = baseStageData; // Keep stageData for compatibility
                if (logDebugInfo)
                    Debug.Log("Loaded encoded stage data successfully");
            }
            else
            {
                // Direct JSON parsing if not encoded
                StageDataJson stageDataJson = JsonUtility.FromJson<StageDataJson>(jsonText);
                baseStageData = new StageData
                {
                    nVer = stageDataJson.nVer,
                    fStageClipWidth = stageDataJson.fStageClipWidth,
                    Datas = stageDataJson.Datas
                };
                stageData = baseStageData; // Keep stageData for compatibility
                if (logDebugInfo)
                    Debug.Log("Loaded raw JSON stage data successfully");
            }
        }
        catch (Exception e)
        {
            Debug.LogError($"Failed to load stage data: {e.Message}\n{e.StackTrace}");
        }
    }

    [ContextMenu("Import and Merge Related Files")]
    public void ImportAndMergeRelatedFiles()
    {
        if (stageDataJsonFile == null)
        {
            Debug.LogError("No base stage data file assigned!");
            return;
        }

        // Clear existing additional files
        additionalStageDataFiles.Clear();

        // Get the base file path
        string assetPath = AssetDatabase.GetAssetPath(stageDataJsonFile);
        
        // Check if the asset path is valid
        if (string.IsNullOrEmpty(assetPath))
        {
            Debug.LogError("The stage data file doesn't have a valid asset path. It might be a runtime-created TextAsset.");
            return;
        }
        
        baseFilePath = assetPath;
        
        // Extract the base name without extension
        string baseName = Path.GetFileNameWithoutExtension(assetPath);
        
        // Get directory safely
        string directory = Path.GetDirectoryName(assetPath);
        if (string.IsNullOrEmpty(directory))
        {
            Debug.LogError($"Could not determine directory for path: {assetPath}");
            return;
        }
        
        // Check if the base name already has an _e suffix
        string baseNameWithoutSuffix = baseName;
        if (baseName.Contains("_e"))
        {
            baseNameWithoutSuffix = baseName.Substring(0, baseName.LastIndexOf("_e"));
        }
        
        // Find all related files with _e suffix
        string[] allFiles = Directory.GetFiles(directory, $"{baseNameWithoutSuffix}_e*.json");
        
        foreach (string filePath in allFiles)
        {
            // Skip the base file
            if (filePath == assetPath)
                continue;
                
            // Load the file as a TextAsset
            TextAsset textAsset = AssetDatabase.LoadAssetAtPath<TextAsset>(filePath);
            if (textAsset != null)
            {
                additionalStageDataFiles.Add(textAsset);
                Debug.Log($"Added related file: {filePath}");
            }
        }
        
        Debug.Log($"Found {additionalStageDataFiles.Count} related files for {baseName}");
    }

    // Modify the MergeAdditionalStageData method to store extension data separately
    private void MergeAdditionalStageData()
    {
        if (baseStageData == null)
        {
            Debug.LogError("Base stage data not loaded!");
            return;
        }
        
        // Clear existing extension data
        extensionStageData.Clear();
        
        foreach (TextAsset additionalFile in additionalStageDataFiles)
        {
            try
            {
                string jsonText = additionalFile.text;
                StageData additionalStageData = null;
                
                // Check if the data is encoded
                if (!jsonText.StartsWith("{"))
                {
                    additionalStageData = StageData.LoadByJSONStr(jsonText);
                }
                else
                {
                    // Direct JSON parsing if not encoded
                    StageDataJson stageDataJson = JsonUtility.FromJson<StageDataJson>(jsonText);
                    additionalStageData = new StageData
                    {
                        nVer = stageDataJson.nVer,
                        fStageClipWidth = stageDataJson.fStageClipWidth,
                        Datas = stageDataJson.Datas
                    };
                }
                
                if (additionalStageData != null)
                {
                    // Store the extension data separately
                    extensionStageData.Add(additionalStageData);
                    
                    // Also merge into the main stageData for compatibility
                    if (createSeparateRootForExtensions)
                    {
                        // If using separate roots, we don't need to merge
                        // But we keep stageData updated for compatibility with other methods
                        stageData = new StageData
                        {
                            nVer = baseStageData.nVer,
                            fStageClipWidth = baseStageData.fStageClipWidth,
                            Datas = new List<StageGroupData>(baseStageData.Datas)
                        };
                        
                        // Add extension data groups to stageData
                        stageData.Datas.AddRange(additionalStageData.Datas);
                    }
                    else
                    {
                        // If not using separate roots, merge directly
                        baseStageData.Datas.AddRange(additionalStageData.Datas);
                        stageData = baseStageData;
                    }
                    
                    if (logDebugInfo)
                        Debug.Log($"Processed extension data from {additionalFile.name} with {additionalStageData.Datas.Count} groups");
                }
            }
            catch (Exception e)
            {
                Debug.LogError($"Failed to load additional stage data from {additionalFile.name}: {e.Message}\n{e.StackTrace}");
            }
        }
        
        if (logDebugInfo)
        {
            int totalGroups = baseStageData.Datas.Count;
            foreach (StageData extData in extensionStageData)
            {
                totalGroups += extData.Datas.Count;
            }
            Debug.Log($"Total groups after processing: {totalGroups}");
        }
    }

    // Modify the CreateScene method to handle separate roots for extensions
    private void CreateScene()
    {
        if (stageData == null)
        {
            Debug.LogError("No stage data loaded!");
            return;
        }
    
        // Create a new scene
        Scene newScene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
        
        // Create a root GameObject for the stage
        GameObject stageRoot = new GameObject("StageRoot");
        
        // Create a separate root for extension files if enabled
        GameObject extensionRoot = null;
        if (createSeparateRootForExtensions && enableMultiFileImport && additionalStageDataFiles.Count > 0)
        {
            extensionRoot = new GameObject(extensionRootName);
        }
        
        // Add necessary components
        stageRoot.AddComponent<StageUpdate>();       
    
        // Process each group in the base stage data
        if (baseStageData != null && baseStageData.Datas != null)
        {
            foreach (StageGroupData groupData in baseStageData.Datas)
            {
                ProcessStageGroup(groupData, stageRoot.transform);
            }
        }
        
        // Process each group in the extension stage data
        if (extensionRoot != null && extensionStageData != null && extensionStageData.Count > 0)
        {
            foreach (StageData extData in extensionStageData)
            {
                if (extData != null && extData.Datas != null)
                {
                    foreach (StageGroupData groupData in extData.Datas)
                    {
                        ProcessStageGroup(groupData, extensionRoot.transform);
                    }
                }
            }
        }
    
        // Save the scene
        EditorSceneManager.SaveScene(newScene, outputScenePath);
        Debug.Log($"Scene saved to {outputScenePath}");
    }
	
    private string ExtractGroupIDFromProperty(string property)
    {
        if (string.IsNullOrEmpty(property))
            return "";
            
        // Split the property string by semicolons
        string[] parts = property.Split(';');
        
        // Look for a part that contains "sGroupID="
        foreach (string part in parts)
        {
            if (part.StartsWith("sGroupID="))
            {
                // Extract the value after "sGroupID="
                return part.Substring("sGroupID=".Length);
            }
        }
        
        return "";
    }

    // Modify the ProcessStageGroup method to better handle group naming
    private void ProcessStageGroup(StageGroupData groupData, Transform parentTransform)
    {
        // Create a group root GameObject with a meaningful name
        string groupName = "Group";
        string groupID = "";
        
        // Try to find a representative object in the group to get its group ID
        if (groupData.Datas.Count > 0)
        {
            foreach (StageObjData objData in groupData.Datas)
            {
                if (!string.IsNullOrEmpty(objData.sGroupID))
                {
                    groupID = objData.sGroupID;
                    break;
                }
                
                // If no direct sGroupID, try to extract from property
                if (!string.IsNullOrEmpty(objData.property))
                {
                    groupID = ExtractGroupIDFromProperty(objData.property);
                    if (!string.IsNullOrEmpty(groupID))
                        break;
                }
            }
        }
        
        // Use the group ID if found
        if (!string.IsNullOrEmpty(groupID))
        {
            groupName = groupID;
        }
        
        // Append index if enabled
        if (appendGroupIndex)
        {
            groupName += $"_{objectCounter}";
        }
        
        GameObject groupRoot = new GameObject(groupName);
        objectCounter++;
        
        groupRoot.transform.SetParent(parentTransform);
        
        StageGroupRoot groupRootComponent = groupRoot.AddComponent<StageGroupRoot>();
        
        // Set the group ID
        if (groupRootComponent.GetType().GetMethod("SetSGroupID") != null)
        {
            groupRootComponent.SetSGroupID(groupID);
        }
        
        // Add to dictionary for later reference
        if (!string.IsNullOrEmpty(groupID))
        {
            groupRoots[groupID] = groupRoot.transform;
        }
        
        // Set clip boundaries
        BoxCollider2D boxCollider = groupRoot.AddComponent<BoxCollider2D>();
        boxCollider.isTrigger = true;
        boxCollider.size = new Vector2(groupData.fClipMaxx - groupData.fClipMinx, 20f); // Arbitrary height
        boxCollider.offset = new Vector2((groupData.fClipMaxx + groupData.fClipMinx) / 2f, 0f);
        
        if (logDebugInfo)
            Debug.Log($"Processing group {groupName} with {groupData.Datas.Count} objects, clip range: {groupData.fClipMinx} to {groupData.fClipMaxx}, Group ID: {groupID}");
    
        // Process each object in the group
        foreach (StageObjData objData in groupData.Datas)
        {
            ProcessStageObject(objData, groupRoot.transform);
        }
    }

    // Modify the ProcessStageObject method to handle parent-child relationships based on group IDs
    private void ProcessStageObject(StageObjData objData, Transform parentTransform)
    {
        try
        {
            GameObject objInstance = null;
    
            // Try to find the prefab using the bundle path and asset path
            objInstance = FindPrefabInProject(objData);
    
            // If we still don't have an instance, create a placeholder
            if (objInstance == null)
            {
                if (createEmptyPrefabsForMissing)
                {
                    objInstance = new GameObject(objData.name);
                    if (logDebugInfo)
                        Debug.LogWarning($"Created placeholder for {objData.name} (path: {objData.path}, bundle: {objData.bunldepath})");
                }
                else
                {
                    if (logDebugInfo)
                        Debug.LogError($"Failed to create object {objData.name} (path: {objData.path}, bundle: {objData.bunldepath})");
                    return;
                }
            }
    
            // Set name and transform properties
            objInstance.name = objData.name;
            
            // Check if this object should be parented to a specific group based on sGroupID
            if (!string.IsNullOrEmpty(objData.sGroupID) && groupRoots.ContainsKey(objData.sGroupID))
            {
                objInstance.transform.SetParent(groupRoots[objData.sGroupID]);
            }
            else
            {
                objInstance.transform.SetParent(parentTransform);
            }
            
            objInstance.transform.localPosition = objData.position;
            objInstance.transform.localRotation = objData.rotate;
            objInstance.transform.localScale = objData.scale;
    
            // Apply properties if available
            if (!string.IsNullOrEmpty(objData.property))
            {
                ApplyProperties(objInstance, objData.property);
            }
    
            if (logDebugInfo)
                Debug.Log($"Created object: {objData.name} at position {objData.position}");
        }
        catch (Exception e)
        {
            Debug.LogError($"Error processing object {objData.name}: {e.Message}\n{e.StackTrace}");
        }
    }

    private GameObject FindPrefabInProject(StageObjData objData)
    {
        // Check cache first
        string cacheKey = $"{objData.bunldepath}/{objData.path}";
        if (prefabCache.ContainsKey(cacheKey))
            return GameObject.Instantiate(prefabCache[cacheKey]);

        GameObject prefab = null;
        
        // Try to find by path directly
        if (!string.IsNullOrEmpty(objData.path))
        {
            // Try various path formats
            string[] pathFormats = new string[] 
            {
                $"{objData.path}.prefab",
                $"{objData.path}",
                $"Assets/{objData.path}.prefab",
                $"Assets/{objData.path}",
                $"Assets/Resources/{objData.path}.prefab",
                $"Assets/Resources/{objData.path}"
            };

            foreach (string pathFormat in pathFormats)
            {
                prefab = AssetDatabase.LoadAssetAtPath<GameObject>(pathFormat);
                if (prefab != null)
                {
                    if (logDebugInfo)
                        Debug.Log($"Found prefab at path: {pathFormat}");
                    break;
                }
            }
        }

        // If not found by direct path, search in specified directories
        if (prefab == null && !string.IsNullOrEmpty(objData.path))
        {
            string prefabName = Path.GetFileName(objData.path);
            
            foreach (string searchPath in assetSearchPaths)
            {
                string fullPath = $"{searchPath}/{prefabName}.prefab";
                prefab = AssetDatabase.LoadAssetAtPath<GameObject>(fullPath);
                if (prefab != null)
                {
                    if (logDebugInfo)
                        Debug.Log($"Found prefab at search path: {fullPath}");
                    break;
                }
            }
        }

        // If still not found and searchAllAssets is true, do a project-wide search
        if (prefab == null && searchAllAssets && !string.IsNullOrEmpty(objData.path))
        {
            string prefabName = Path.GetFileName(objData.path);
            string[] guids = AssetDatabase.FindAssets($"t:GameObject {prefabName}");
            
            foreach (string guid in guids)
            {
                string assetPath = AssetDatabase.GUIDToAssetPath(guid);
                GameObject asset = AssetDatabase.LoadAssetAtPath<GameObject>(assetPath);
                
                if (asset != null && asset.name == prefabName)
                {
                    prefab = asset;
                    if (logDebugInfo)
                        Debug.Log($"Found prefab by project search: {assetPath}");
                    break;
                }
            }
        }

        // Try to find by property string if we have it
        if (prefab == null && !string.IsNullOrEmpty(objData.property))
        {
            prefab = CreateFromProperty(objData.property);
            if (prefab != null && logDebugInfo)
                Debug.Log($"Created prefab from property string for {objData.name}");
        }

        // If we found a prefab, cache it and instantiate it
        if (prefab != null)
        {
            prefabCache[cacheKey] = prefab;
            return GameObject.Instantiate(prefab);
        }

        return null;
    }

    private GameObject CreateFromProperty(string property)
    {
        if (string.IsNullOrEmpty(property))
            return null;

        // Parse the property string to determine the object type
        string[] propertyParts = property.Split(';');
        if (propertyParts.Length == 0)
            return null;

        // The first part should contain the object type
        string typeStr = propertyParts[0];
        
        // Try to find the object type
        foreach (StageObjType objType in Enum.GetValues(typeof(StageObjType)))
        {
            if (typeStr.StartsWith(objType.ToString()))
            {
                // Create appropriate GameObject based on type
                GameObject go = new GameObject(objType.ToString());
                
                // Add appropriate component based on the object type
                switch (objType)
                {
                    case StageObjType.DEADAREA_OBJ:
                        go.AddComponent<DeadAreaEvent>();
                        break;
                    case StageObjType.ENEMYEP_OBJ:
                        go.AddComponent<EnemyEventPoint>();
                        break;
                    case StageObjType.LOCK_RANGE_OBJ:
                        go.AddComponent<LockRangeEvent>();
                        break;
                    case StageObjType.STAGECOLLISION_OBJ:
                        go.AddComponent<MapCollisionEvent>();
                        break;
                    case StageObjType.MAPEVENT_OBJ:
                        go.AddComponent<MapObjEvent>();
                        break;
                    case StageObjType.BLOCKWALL_OBJ:
                        go.AddComponent<StageBlockWall>();
                        break;
                    case StageObjType.STAGECTRL_OBJ:
                        go.AddComponent<StageCtrlEvent>();
                        break;
                    case StageObjType.ENEMY_OBJ:
                        go.AddComponent<StageEnemy>();
                        break;
                    case StageObjType.END_OBJ:
                        go.AddComponent<StageEndPoint>();
                        break;
                    case StageObjType.STAGEONEWORK_OBJ:
                        go.AddComponent<StageOneWorkEvent>();
                        break;
                    case StageObjType.PATROLPATH_OBJ:
                        go.AddComponent<StagePatrolPath>();
                        break;
                    case StageObjType.STAGEREBORN_OBJ:
                        go.AddComponent<StageRebounEvent>();
                        break;
                    case StageObjType.RIDEABLE_OBJ:
                        go.AddComponent<StageRideableObj>();
                        break;
                    case StageObjType.START_OBJ:
                        go.AddComponent<StageStartPoint>();
                        break;
                    case StageObjType.DATAPOING_OBJ:
                        go.AddComponent<StageDataPoint>();
                        break;
                }
                
                // Add BoxCollider2D if needed
                if (go.GetComponent<EventPointBase>() != null)
                {
                    go.AddComponent<BoxCollider2D>();
                }
                
                return go;
            }
        }

        return null;
    }

    // Modify the ApplyProperties method to extract and store the group ID
    private void ApplyProperties(GameObject objInstance, string property)
    {
        if (string.IsNullOrEmpty(property))
            return;
    
        // Extract the group ID if present
        string groupID = ExtractGroupIDFromProperty(property);
        if (!string.IsNullOrEmpty(groupID))
        {
            // Store the group ID in a component for reference
            StageObjParam param = objInstance.GetComponent<StageObjParam>();
            if (param == null)
                param = objInstance.AddComponent<StageObjParam>();
                
            // We can't use SetGroupID as it doesn't exist
            // Instead, we can add a custom component to store this information
            GroupIDHolder groupIDHolder = objInstance.GetComponent<GroupIDHolder>() ?? objInstance.AddComponent<GroupIDHolder>();
            groupIDHolder.groupID = groupID;
            
            // Log the group ID for debugging
            if (logDebugInfo)
                Debug.Log($"Object {objInstance.name} has group ID: {groupID}");
        }
    
        // Rest of the ApplyProperties method...
        string[] propertyParts = property.Split(';');
        if (propertyParts.Length == 0)
            return;
    
        // The first part should contain the object type
        string typeStr = propertyParts[0];
        
        // Find the appropriate component based on the object type
        StageSLBase slComponent = null;
        
        foreach (StageObjType objType in Enum.GetValues(typeof(StageObjType)))
        {
            if (typeStr.StartsWith(objType.ToString()))
            {
                // Get or add the appropriate component based on the object type
                switch (objType)
                {
                    case StageObjType.DEADAREA_OBJ:
                        slComponent = objInstance.GetComponent<DeadAreaEvent>() ?? objInstance.AddComponent<DeadAreaEvent>();
                        break;
                    case StageObjType.ENEMYEP_OBJ:
                        slComponent = objInstance.GetComponent<EnemyEventPoint>() ?? objInstance.AddComponent<EnemyEventPoint>();
                        break;
                    case StageObjType.LOCK_RANGE_OBJ:
                        slComponent = objInstance.GetComponent<LockRangeEvent>() ?? objInstance.AddComponent<LockRangeEvent>();
                        break;
                    case StageObjType.STAGECOLLISION_OBJ:
                        slComponent = objInstance.GetComponent<MapCollisionEvent>() ?? objInstance.AddComponent<MapCollisionEvent>();
                        break;
                    case StageObjType.MAPEVENT_OBJ:
                        slComponent = objInstance.GetComponent<MapObjEvent>() ?? objInstance.AddComponent<MapObjEvent>();
                        break;
                    case StageObjType.BLOCKWALL_OBJ:
                        slComponent = objInstance.GetComponent<StageBlockWall>() ?? objInstance.AddComponent<StageBlockWall>();
                        break;
                    case StageObjType.STAGECTRL_OBJ:
                        slComponent = objInstance.GetComponent<StageCtrlEvent>() ?? objInstance.AddComponent<StageCtrlEvent>();
                        break;
                    case StageObjType.ENEMY_OBJ:
                        slComponent = objInstance.GetComponent<StageEnemy>() ?? objInstance.AddComponent<StageEnemy>();
                        break;
                    case StageObjType.END_OBJ:
                        slComponent = objInstance.GetComponent<StageEndPoint>() ?? objInstance.AddComponent<StageEndPoint>();
                        break;
                    case StageObjType.STAGEONEWORK_OBJ:
                        slComponent = objInstance.GetComponent<StageOneWorkEvent>() ?? objInstance.AddComponent<StageOneWorkEvent>();
                        break;
                    case StageObjType.PATROLPATH_OBJ:
                        slComponent = objInstance.GetComponent<StagePatrolPath>() ?? objInstance.AddComponent<StagePatrolPath>();
                        break;
                    case StageObjType.STAGEREBORN_OBJ:
                        slComponent = objInstance.GetComponent<StageRebounEvent>() ?? objInstance.AddComponent<StageRebounEvent>();
                        break;
                    case StageObjType.RIDEABLE_OBJ:
                        slComponent = objInstance.GetComponent<StageRideableObj>() ?? objInstance.AddComponent<StageRideableObj>();
                        break;
                    case StageObjType.START_OBJ:
                        slComponent = objInstance.GetComponent<StageStartPoint>() ?? objInstance.AddComponent<StageStartPoint>();
                        break;
                    case StageObjType.DATAPOING_OBJ:
                        slComponent = objInstance.GetComponent<StageDataPoint>() ?? objInstance.AddComponent<StageDataPoint>();
                        break;
                    default:
                        if (logDebugInfo)
                            Debug.LogWarning($"Unhandled object type: {objType}");
                        break;
                }
                
                break;
            }
        }

        // If we found a component, load the properties
        if (slComponent != null)
        {
            try
            {
                slComponent.LoadByString(property);
                
                // Generate a unique sync ID if needed
                if (string.IsNullOrEmpty(slComponent.sSyncID))
                {
                    slComponent.sSyncID = GenerateSyncId();
                }
                
                // Add collider if needed
                if (objInstance.GetComponent<Collider2D>() == null && 
                    (slComponent is EventPointBase || slComponent is DeadAreaEvent || slComponent is LockRangeEvent))
                {
                    BoxCollider2D collider = objInstance.AddComponent<BoxCollider2D>();
                    collider.isTrigger = true;
                    collider.size = new Vector2(2f, 2f); // Default size
                }
                
                if (logDebugInfo)
                    Debug.Log($"Applied properties to {objInstance.name}, type: {slComponent.GetType().Name}");
            }
            catch (Exception e)
            {
                Debug.LogError($"Error applying properties to {objInstance.name}: {e.Message}");
            }
        }
        else
        {
            if (logDebugInfo)
                Debug.LogWarning($"Could not find appropriate component for property: {property}");
        }
    }

    private string GenerateSyncId()
    {
        return "SyncID_" + (objectCounter++).ToString();
    }

    [ContextMenu("Load Stage Data From File")]
    public void LoadStageDataFromFile()
    {
        string path = EditorUtility.OpenFilePanel("Select Stage Data JSON File", "", "json,txt");
        if (string.IsNullOrEmpty(path))
            return;

        try
        {
            string jsonText = File.ReadAllText(path);
            TextAsset textAsset = new TextAsset(jsonText);
            stageDataJsonFile = textAsset;
            
            Debug.Log($"Loaded stage data from {path}");
        }
        catch (Exception e)
        {
            Debug.LogError($"Failed to load stage data from file: {e.Message}");
        }
    }

    // Helper method to find all prefabs in the project
    [ContextMenu("Find All Prefabs")]
    public void FindAllPrefabs()
    {
        string[] guids = AssetDatabase.FindAssets("t:Prefab");
        Debug.Log($"Found {guids.Length} prefabs in the project");
        
        // Log the first 10 prefabs
        for (int i = 0; i < Math.Min(10, guids.Length); i++)
        {
            string path = AssetDatabase.GUIDToAssetPath(guids[i]);
            GameObject prefab = AssetDatabase.LoadAssetAtPath<GameObject>(path);
            Debug.Log($"Prefab {i+1}: {prefab.name} at {path}");
        }
    }

    // Helper method to search for a specific prefab by name
    public void FindPrefabByName(string prefabName)
    {
        string[] guids = AssetDatabase.FindAssets($"t:Prefab {prefabName}");
        Debug.Log($"Found {guids.Length} prefabs matching '{prefabName}'");
        
        foreach (string guid in guids)
        {
            string path = AssetDatabase.GUIDToAssetPath(guid);
            GameObject prefab = AssetDatabase.LoadAssetAtPath<GameObject>(path);
            Debug.Log($"Found prefab: {prefab.name} at {path}");
        }
    }

    // Helper method to extract all unique paths from the stage data
    [ContextMenu("Extract All Paths")]
    public void ExtractAllPaths()
    {
        if (stageData == null)
        {
            Debug.LogError("No stage data loaded!");
            return;
        }

        HashSet<string> uniquePaths = new HashSet<string>();
        HashSet<string> uniqueBundlePaths = new HashSet<string>();
        
        foreach (StageGroupData groupData in stageData.Datas)
        {
            foreach (StageObjData objData in groupData.Datas)
            {
                if (!string.IsNullOrEmpty(objData.path))
                    uniquePaths.Add(objData.path);
                
                if (!string.IsNullOrEmpty(objData.bunldepath))
                    uniqueBundlePaths.Add(objData.bunldepath);
            }
        }
        
        Debug.Log($"Found {uniquePaths.Count} unique paths and {uniqueBundlePaths.Count} unique bundle paths");
        
        // Log all unique paths
        Debug.Log("Unique paths:");
        foreach (string path in uniquePaths)
        {
            Debug.Log(path);
        }
        
        // Log all unique bundle paths
        Debug.Log("Unique bundle paths:");
        foreach (string bundlePath in uniqueBundlePaths)
        {
            Debug.Log(bundlePath);
        }
    }
	
    // Update the ExtractAllGroupIDs method to not use sGroupID from StageGroupData
    [ContextMenu("Extract All Group IDs")]
    public void ExtractAllGroupIDs()
    {
        if (stageData == null)
        {
            Debug.LogError("No stage data loaded!");
            return;
        }
    
        HashSet<string> uniqueGroupIDs = new HashSet<string>();
        
        // We can only extract group IDs from StageObjData objects
        foreach (StageGroupData groupData in stageData.Datas)
        {
            foreach (StageObjData objData in groupData.Datas)
            {
                if (!string.IsNullOrEmpty(objData.sGroupID))
                    uniqueGroupIDs.Add(objData.sGroupID);
            }
        }
        
        Debug.Log($"Found {uniqueGroupIDs.Count} unique group IDs");
        
        // Log all unique group IDs
        Debug.Log("Unique group IDs:");
        foreach (string groupID in uniqueGroupIDs)
        {
            Debug.Log(groupID);
        }
    }
}

// Editor window for the stage deserializer
#if UNITY_EDITOR
[CustomEditor(typeof(StageSceneDeserializer))]
public class StageSceneDeserializerEditor : UnityEditor.Editor
{
    private string searchPrefabName = "";
    private bool showMultiFileSettings = false;
    private bool showExtensionSettings = false;

    public override void OnInspectorGUI()
    {
        DrawDefaultInspector();

        StageSceneDeserializer deserializer = (StageSceneDeserializer)target;

        EditorGUILayout.Space();
        EditorGUILayout.LabelField("Stage Data Operations", EditorStyles.boldLabel);

        if (GUILayout.Button("Load Stage Data From File"))
        {
            deserializer.LoadStageDataFromFile();
        }

        if (GUILayout.Button("Deserialize Stage Data"))
        {
            deserializer.DeserializeStageData();
        }

        // Multi-file import section
        EditorGUILayout.Space();
        showMultiFileSettings = EditorGUILayout.Foldout(showMultiFileSettings, "Multi-File Import Settings", true);
        
        if (showMultiFileSettings)
        {
            EditorGUI.indentLevel++;
            
            SerializedProperty enableMultiFileImportProp = serializedObject.FindProperty("enableMultiFileImport");
            EditorGUILayout.PropertyField(enableMultiFileImportProp, new GUIContent("Enable Multi-File Import"));
            
            SerializedProperty autoDetectRelatedFilesProp = serializedObject.FindProperty("autoDetectRelatedFiles");
            EditorGUILayout.PropertyField(autoDetectRelatedFilesProp, new GUIContent("Auto-Detect Related Files"));
            
            if (GUILayout.Button("Import and Merge Related Files"))
            {
                deserializer.ImportAndMergeRelatedFiles();
            }
            
            SerializedProperty additionalFilesProp = serializedObject.FindProperty("additionalStageDataFiles");
            EditorGUILayout.PropertyField(additionalFilesProp, new GUIContent("Additional Stage Data Files"), true);
            
            EditorGUI.indentLevel--;
        }
        
        // Extension settings section
        EditorGUILayout.Space();
        showExtensionSettings = EditorGUILayout.Foldout(showExtensionSettings, "Extension File Settings", true);
        
        if (showExtensionSettings)
        {
            EditorGUI.indentLevel++;
            
            SerializedProperty createSeparateRootProp = serializedObject.FindProperty("createSeparateRootForExtensions");
            EditorGUILayout.PropertyField(createSeparateRootProp, new GUIContent("Create Separate Root for Extensions"));
            
            SerializedProperty extensionRootNameProp = serializedObject.FindProperty("extensionRootName");
            EditorGUILayout.PropertyField(extensionRootNameProp, new GUIContent("Extension Root Name"));
            
            EditorGUI.indentLevel--;
        }
        
        serializedObject.ApplyModifiedProperties();

        EditorGUILayout.Space();
        EditorGUILayout.LabelField("Prefab Search Tools", EditorStyles.boldLabel);

        if (GUILayout.Button("Find All Prefabs"))
        {
            deserializer.FindAllPrefabs();
        }

        EditorGUILayout.BeginHorizontal();
        searchPrefabName = EditorGUILayout.TextField("Prefab Name", searchPrefabName);
        if (GUILayout.Button("Search", GUILayout.Width(100)))
        {
            deserializer.FindPrefabByName(searchPrefabName);
        }
        EditorGUILayout.EndHorizontal();

        if (GUILayout.Button("Extract All Paths From Stage Data"))
        {
            deserializer.ExtractAllPaths();
        }
    }
}
#endif
