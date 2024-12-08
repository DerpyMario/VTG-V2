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
    private string jsonPath = "";
	private string prefabRootPath = "Assets/Prefabs";
    private string bundleRootPath = "Assets/AssetBundles";
    private Vector2 scrollPosition;
    private bool showRawJson = false;
    private bool showSceneTools = false;

    private readonly JsonSerializerSettings jsonSettings = new JsonSerializerSettings
    {
        Converters = new List<JsonConverter>
        {
            new FloatConverter(3),
            new Vector3Converter(),
            new QuaternionConverter()
        },
        Formatting = Formatting.Indented
    };

    [MenuItem("Tools/Stage Data Editor")]
    public static void ShowWindow()
    {
        GetWindow<StageLibDataEditor>("Stage Data Editor");
    }

    private void OnGUI()
    {
        EditorGUILayout.BeginVertical();

        DrawFileOperations();
        DrawSceneTools();
        DrawStageDataEditor();
		DrawStageSetBrowser();

        EditorGUILayout.EndVertical();
    }

    private void DrawFileOperations()
    {
        EditorGUILayout.BeginHorizontal();
        if (GUILayout.Button("Load JSON", GUILayout.Width(100)))
        {
            LoadJsonFile();
        }
        if (GUILayout.Button("Save JSON", GUILayout.Width(100)))
        {
            SaveJsonFile();
        }
        if (GUILayout.Button("Export Raw", GUILayout.Width(100)))
        {
            ExportRawJson();
        }
        EditorGUILayout.EndHorizontal();
    }

    private void DrawSceneTools()
    {
        showSceneTools = EditorGUILayout.Foldout(showSceneTools, "Scene Tools");
        if (showSceneTools && currentStageData != null)
        {
            EditorGUILayout.BeginHorizontal();
            if (GUILayout.Button("Restore Scene"))
            {
                RestoreSceneFromJson();
            }
            if (GUILayout.Button("Capture Scene"))
            {
                CaptureSceneToJson();
            }
            EditorGUILayout.EndHorizontal();
        }
    }

    private void DrawStageDataEditor()
    {
        if (currentStageData == null) return;

        scrollPosition = EditorGUILayout.BeginScrollView(scrollPosition);

        EditorGUI.BeginChangeCheck();
        DrawStageProperties();
        DrawStageGroups();
        DrawRawJsonView();

        EditorGUILayout.EndScrollView();
    }

    private void DrawStageSetBrowser()
    {
        EditorGUILayout.Space();
        EditorGUILayout.LabelField("Stage Set Browser", EditorStyles.boldLabel);
        
        if (currentStageData != null && !string.IsNullOrEmpty(jsonFilePath))
        {
            string directory = Path.GetDirectoryName(jsonFilePath);
            string fileNameWithoutExt = Path.GetFileNameWithoutExtension(jsonFilePath);
            
            int eIndex = fileNameWithoutExt.LastIndexOf("_e");
            if (eIndex != -1)
            {
                fileNameWithoutExt = fileNameWithoutExt.Substring(0, eIndex);
            }
    
            string[] stageSetFiles = Directory.GetFiles(directory, fileNameWithoutExt + "_e*.json");
            
            EditorGUILayout.BeginVertical(EditorStyles.helpBox);
            foreach (string filePath in stageSetFiles)
            {
                EditorGUILayout.BeginHorizontal();
                EditorGUILayout.LabelField(Path.GetFileName(filePath));
                
                if (GUILayout.Button("Load", GUILayout.Width(60)))
                {
                    string jsonText = File.ReadAllText(filePath);
                    currentStageData = StageData.LoadByJSONStr(jsonText);
                    jsonFilePath = filePath;
                }
    
                if (GUILayout.Button("Merge", GUILayout.Width(60)))
                {
                    string jsonText = File.ReadAllText(filePath);
                    StageData setData = StageData.LoadByJSONStr(jsonText);
                    MergeStageData(setData);
                }
                EditorGUILayout.EndHorizontal();
            }
            EditorGUILayout.EndVertical();
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
            }
        }
    }
	
    private void DrawStageProperties()
    {
        EditorGUILayout.LabelField("Stage Properties", EditorStyles.boldLabel);
        EditorGUILayout.BeginVertical(EditorStyles.helpBox);
        currentStageData.nVer = EditorGUILayout.IntField("Version", currentStageData.nVer);
        currentStageData.fStageClipWidth = EditorGUILayout.FloatField("Stage Clip Width", currentStageData.fStageClipWidth);
        EditorGUILayout.EndVertical();
        EditorGUILayout.Space();
    }

    private void DrawStageGroups()
    {
        EditorGUILayout.LabelField("Stage Groups", EditorStyles.boldLabel);
        for (int i = 0; i < currentStageData.Datas.Count; i++)
        {
            DrawStageGroupData(currentStageData.Datas[i], i);
        }

        if (GUILayout.Button("Add Group"))
        {
            currentStageData.Datas.Add(new StageGroupData());
        }
    }

    private void DrawStageGroupData(StageGroupData groupData, int index)
    {
        EditorGUILayout.BeginVertical(EditorStyles.helpBox);
        
        groupData.fClipMinx = EditorGUILayout.FloatField("Clip Min X", groupData.fClipMinx);
        groupData.fClipMaxx = EditorGUILayout.FloatField("Clip Max X", groupData.fClipMaxx);

        EditorGUILayout.LabelField("Objects", EditorStyles.boldLabel);
        for (int i = 0; i < groupData.Datas.Count; i++)
        {
            DrawStageObjectData(groupData.Datas[i]);
        }

        if (GUILayout.Button("Add Object"))
        {
            groupData.Datas.Add(new StageObjData());
        }

        if (GUILayout.Button("Remove Group"))
        {
            currentStageData.Datas.RemoveAt(index);
        }

        EditorGUILayout.EndVertical();
        EditorGUILayout.Space();
    }

    private void DrawStageObjectData(StageObjData objData)
    {
        EditorGUILayout.BeginVertical(EditorStyles.helpBox);
        
        objData.name = EditorGUILayout.TextField("Name", objData.name);
        objData.position = EditorGUILayout.Vector3Field("Position", objData.position);
        objData.scale = EditorGUILayout.Vector3Field("Scale", objData.scale);
        objData.rotate = Quaternion.Euler(EditorGUILayout.Vector3Field("Rotation", objData.rotate.eulerAngles));
        objData.path = EditorGUILayout.TextField("Path", objData.path);
        objData.bunldepath = EditorGUILayout.TextField("Bundle Path", objData.bunldepath);

        if (GUILayout.Button("Edit Properties"))
        {
            EditObjectProperties(objData);
        }

        EditorGUILayout.EndVertical();
    }

    private void EditObjectProperties(StageObjData objData)
    {
        var propertyWindow = CreateInstance<StageObjectPropertyWindow>();
        propertyWindow.Initialize(objData, jsonSettings);
        propertyWindow.ShowUtility();
    }

    private void DrawRawJsonView()
    {
        showRawJson = EditorGUILayout.Toggle("Show Raw JSON", showRawJson);
        if (showRawJson)
        {
            string rawJson = JsonConvert.SerializeObject(currentStageData, jsonSettings);
            EditorGUILayout.TextArea(rawJson);
        }
    }

    private void LoadJsonFile()
    {
        string path = EditorUtility.OpenFilePanel("Load Stage JSON", "", "json");
        if (string.IsNullOrEmpty(path)) return;
    
        jsonFilePath = path;
        string jsonText = File.ReadAllText(path);
        currentStageData = StageData.LoadByJSONStr(jsonText);
    
        if (EditorUtility.DisplayDialog("Load Stage Set", 
            "Do you want to merge stage set (_e) files?", "Yes", "No"))
        {
            MergeStageSetData();
        }
    }
    
    private void MergeStageSetData()
    {
        string directory = Path.GetDirectoryName(jsonFilePath);
        string fileNameWithoutExt = Path.GetFileNameWithoutExtension(jsonFilePath);
        
        int eIndex = fileNameWithoutExt.LastIndexOf("_e");
        if (eIndex != -1)
        {
            fileNameWithoutExt = fileNameWithoutExt.Substring(0, eIndex);
        }
    
        string[] stageSetFiles = Directory.GetFiles(directory, fileNameWithoutExt + "_e*.json");
        
        foreach (string setFile in stageSetFiles)
        {
            string jsonText = File.ReadAllText(setFile);
            StageData setData = StageData.LoadByJSONStr(jsonText);
            
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
                            // Simply merge the property data
                            matchingObj.property = setObj.property;
                        }
                    }
                }
            }
        }
    }
   
    private void LoadStageSetJsons()
    {
        string directory = Path.GetDirectoryName(jsonFilePath);
        string fileNameWithoutExt = Path.GetFileNameWithoutExtension(jsonFilePath);
        
        // Remove existing _e suffix if present
        int eIndex = fileNameWithoutExt.LastIndexOf("_e");
        if (eIndex != -1)
        {
            fileNameWithoutExt = fileNameWithoutExt.Substring(0, eIndex);
        }
    
        // Find all _e variations automatically
        string[] allFiles = Directory.GetFiles(directory, fileNameWithoutExt + "_e*.json");
        foreach (string variantPath in allFiles)
        {
            string jsonText = File.ReadAllText(variantPath);
            StageData variantData = StageData.LoadByJSONStr(jsonText);
            
            // Process StageSLBase components and properties
            foreach (var groupData in variantData.Datas)
            {
                foreach (var objData in groupData.Datas)
                {
                    if (!string.IsNullOrEmpty(objData.property))
                    {
                        ProcessStageSLBaseProperties(objData);
                    }
                }
            }
            
            Debug.Log($"Loaded stage variant: {variantPath}");
        }
    }
    
    private void ProcessStageSLBaseProperties(StageObjData objData)
    {
        try
        {
            var token = JToken.Parse(objData.property);
            if (token.Type == JTokenType.Object)
            {
                var properties = token.ToObject<Dictionary<string, JObject>>();
                foreach (var component in properties)
                {
                    if (component.Key.Contains("StageSLBase"))
                    {
                        // Apply StageSLBase properties
                        ApplyStageSLBaseProperties(objData, component.Value);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Debug.LogWarning($"Error processing properties for {objData.name}: {ex.Message}");
        }
    }
    
    private void ApplyStageSLBaseProperties(StageObjData objData, JObject properties)
    {
        foreach (var property in properties)
        {
            // Apply each property from the _e file to the base object
            objData.property = JsonConvert.SerializeObject(properties);
        }
    }

    private void SaveJsonFile()
    {
        if (currentStageData == null) return;

        string path = EditorUtility.SaveFilePanel("Save Stage JSON", "", "stage.json", "json");
        if (string.IsNullOrEmpty(path)) return;

        string encrypted = currentStageData.ConvertJSON();
        File.WriteAllText(path, encrypted);
        AssetDatabase.Refresh();
    }

    private void ExportRawJson()
    {
        if (currentStageData == null) return;

        string path = EditorUtility.SaveFilePanel("Export Raw JSON", "", "stage.raw.json", "json");
        if (string.IsNullOrEmpty(path)) return;

        string json = JsonConvert.SerializeObject(currentStageData, jsonSettings);
        File.WriteAllText(path, json);
        AssetDatabase.Refresh();
    }

    private void RestoreSceneFromJson()
    {
        if (!EditorUtility.DisplayDialog("Restore Scene", 
            "This will clear the current scene. Continue?", "Yes", "No")) return;

        ClearCurrentScene();
        CreateStageHierarchy();
        EditorSceneManager.MarkSceneDirty(EditorSceneManager.GetActiveScene());
    }

    private void ClearCurrentScene()
    {
        foreach (GameObject root in FindObjectsOfType<GameObject>())
        {
            if (root.transform.parent == null && root.hideFlags == HideFlags.None)
                DestroyImmediate(root);
        }
    }

    private void CreateStageHierarchy()
    {
        GameObject stageRoot = new GameObject("StageRoot");
        stageRoot.AddComponent<StageGroupRoot>();
    
        foreach (StageGroupData groupData in currentStageData.Datas)
        {
            // Get the first object's sGroupID to name the group
            string groupName = "Group";
            if (groupData.Datas.Count > 0 && !string.IsNullOrEmpty(groupData.Datas[0].sGroupID))
            {
                groupName = groupData.Datas[0].sGroupID;
            }
    
            GameObject groupObj = new GameObject(groupName);
            var groupRoot = groupObj.AddComponent<StageGroupRoot>();
            groupRoot.SetSGroupID(groupName);
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
       List<string> searchPaths = new List<string>();
       
       if (!string.IsNullOrEmpty(objData.path))
       {
           searchPaths.Add(objData.path);
           searchPaths.Add(Path.Combine(prefabRootPath, objData.path));
           searchPaths.Add(Path.Combine("Assets/Resources", objData.path));
       }
       
       if (!string.IsNullOrEmpty(objData.bunldepath))
       {
           // Direct bundle path
           searchPaths.Add(Path.Combine(bundleRootPath, objData.bunldepath));
           
           // Common bundle path patterns
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
    
    private void LoadLightingData()
    {
        string stageName = Path.GetFileNameWithoutExtension(jsonFilePath);
        int eIndex = stageName.LastIndexOf("_e");
        if (eIndex != -1)
        {
            stageName = stageName.Substring(0, eIndex);
        }
    
        string lightmapListPath = $"Assets/rockmanunity/stagelightmap/{stageName}/lightmaplist.json";
        TextAsset lightmapListAsset = AssetDatabase.LoadAssetAtPath<TextAsset>(lightmapListPath);
        
        if (lightmapListAsset != null)
        {
            StageLightMapJson lightMapJson = JsonUtility.FromJson<StageLightMapJson>(lightmapListAsset.text);
            LightmapSettings.lightmaps = new LightmapData[0];
    
            foreach (string lightmapName in lightMapJson.Datas)
            {
                if (!lightmapName.Contains("Lightmap-")) continue;
    
                int startIndex = lightmapName.IndexOf("Lightmap-") + "Lightmap-".Length;
                string lightmapPath = $"Assets/rockmanunity/stagelightmap/{stageName}/{lightmapName}";
    
                if (lightmapName.Contains("_comp_dir"))
                {
                    int endIndex = lightmapName.IndexOf("_comp_dir");
                    int lightmapIndex = int.Parse(lightmapName.Substring(startIndex, endIndex - startIndex));
                    LoadLightmapTexture(lightmapPath, lightmapIndex, isDirectional: true);
                }
                else if (lightmapName.Contains("_comp_light"))
                {
                    int endIndex = lightmapName.IndexOf("_comp_light");
                    int lightmapIndex = int.Parse(lightmapName.Substring(startIndex, endIndex - startIndex));
                    LoadLightmapTexture(lightmapPath, lightmapIndex, isDirectional: false);
                }
            }
        }
    }
    
    private void LoadLightmapTexture(string path, int index, bool isDirectional)
    {
        Texture2D lightmapTexture = AssetDatabase.LoadAssetAtPath<Texture2D>(path);
        if (lightmapTexture == null) return;
    
        LightmapData[] lightmaps = LightmapSettings.lightmaps;
        if (lightmaps.Length <= index)
        {
            var newLightmaps = new LightmapData[index + 1];
            for (int i = 0; i < lightmaps.Length; i++)
            {
                newLightmaps[i] = lightmaps[i];
            }
            for (int i = lightmaps.Length; i <= index; i++)
            {
                newLightmaps[i] = new LightmapData();
            }
            lightmaps = newLightmaps;
        }
    
        if (isDirectional)
        {
            lightmaps[index].lightmapDir = lightmapTexture;
        }
        else
        {
            lightmaps[index].lightmapColor = lightmapTexture;
        }
    
        LightmapSettings.lightmaps = lightmaps;
    }

    private void RestoreComponentProperties(GameObject obj, string propertyData)
    {
        if (string.IsNullOrEmpty(propertyData)) return;
    
        try
        {
            var token = JToken.Parse(propertyData);
            if (token.Type != JTokenType.Object) return;
    
            var propertyObject = token as JObject;
            foreach (var kvp in propertyObject)
            {
                var componentType = System.Type.GetType(kvp.Key);
                if (componentType == null) continue;
    
                Component component = obj.GetComponent(componentType) ?? 
                                    obj.AddComponent(componentType);
    
                var componentData = kvp.Value as JObject;
                if (componentData == null) continue;
    
                foreach (var prop in componentData.Properties())
                {
                    var propertyInfo = componentType.GetProperty(prop.Name);
                    if (propertyInfo?.CanWrite == true)
                    {
                        try
                        {
                            object value = prop.Value.ToObject(propertyInfo.PropertyType, 
                                JsonSerializer.Create(jsonSettings));
                            propertyInfo.SetValue(component, value);
                        }
                        catch (Exception ex)
                        {
                            Debug.LogWarning($"Failed to set property {prop.Name} on {kvp.Key}: {ex.Message}");
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Debug.LogWarning($"Failed to restore component properties: {ex.Message}");
        }
    }

    private void CaptureSceneToJson()
    {
        currentStageData = new StageData
        {
            nVer = 1,
            fStageClipWidth = 100f,
            Datas = new List<StageGroupData>()
        };

        var roots = FindObjectsOfType<StageGroupRoot>();
        foreach (var root in roots)
        {
            CaptureGameObjectHierarchy(root.gameObject);
        }
    }

    private void CaptureGameObjectHierarchy(GameObject obj)
    {
        var groupData = new StageGroupData();
        currentStageData.Datas.Add(groupData);

        foreach (Transform child in obj.transform)
        {
            var objData = CreateStageObjData(child.gameObject);
            groupData.Datas.Add(objData);
        }
    }

    private StageObjData CreateStageObjData(GameObject obj)
    {
        var objData = new StageObjData
        {
            name = obj.name,
            position = obj.transform.position,
            rotate = obj.transform.rotation,
            scale = obj.transform.localScale,
            property = CaptureComponentProperties(obj)
        };

        SetPrefabInfo(obj, objData);
        return objData;
    }

    private void SetPrefabInfo(GameObject obj, StageObjData objData)
    {
        var prefabSource = PrefabUtility.GetCorrespondingObjectFromSource(obj);
        if (prefabSource != null)
        {
            string assetPath = AssetDatabase.GetAssetPath(prefabSource);
            objData.path = Path.GetFileNameWithoutExtension(assetPath);
            objData.bunldepath = Path.GetDirectoryName(assetPath).Replace("Assets/", "");
        }
    }

    private string CaptureComponentProperties(GameObject obj)
    {
        var properties = new Dictionary<string, JObject>();
        
        foreach (Component component in obj.GetComponents<Component>())
        {
            if (component == null || component is Transform) 
                continue;

            var componentData = new JObject();
            var componentType = component.GetType();

            foreach (var prop in componentType.GetProperties())
            {
                if (prop.CanRead && prop.CanWrite && IsSerializableType(prop.PropertyType))
                {
                    try
                    {
                        object value = prop.GetValue(component);
                        if (value != null)
                        {
                            componentData[prop.Name] = JToken.FromObject(value, JsonSerializer.Create(jsonSettings));
                        }
                    }
                    catch
                    {
                        Debug.LogWarning($"Skipping property {prop.Name} on {componentType.Name}");
                    }
                }
            }

            if (componentData.HasValues)
            {
                properties[componentType.FullName] = componentData;
            }
        }

        return JsonConvert.SerializeObject(properties, jsonSettings);
    }

    private bool IsSerializableType(System.Type type)
    {
        return type.IsPrimitive || 
               type == typeof(string) || 
               type == typeof(Vector2) ||
               type == typeof(Vector3) ||
               type == typeof(Vector4) ||
               type == typeof(Quaternion) ||
               type == typeof(Color) ||
               type == typeof(Rect) ||
               type == typeof(Matrix4x4) ||
               type.IsEnum;
    }
}

// Property window for editing object properties
public class StageObjectPropertyWindow : EditorWindow
{
    private StageObjData targetObject;
    private JsonSerializerSettings jsonSettings;
    private Dictionary<string, JObject> properties;
    private Vector2 scrollPosition;
    private bool[] componentFoldouts = new bool[32];

    public void Initialize(StageObjData obj, JsonSerializerSettings settings)
    {
        targetObject = obj;
        jsonSettings = settings;
        titleContent = new GUIContent("Object Properties");
        minSize = new Vector2(400, 300);
        
        if (!string.IsNullOrEmpty(obj.property))
        {
            try
            {
                var token = JToken.Parse(obj.property);
                if (token.Type == JTokenType.Object)
                {
                    properties = token.ToObject<Dictionary<string, JObject>>();
                }
                else
                {
                    properties = new Dictionary<string, JObject>();
                }
            }
            catch
            {
                properties = new Dictionary<string, JObject>();
            }
        }
        else
        {
            properties = new Dictionary<string, JObject>();
        }
    }

    private void OnGUI()
    {
        EditorGUILayout.BeginVertical(EditorStyles.helpBox);
        scrollPosition = EditorGUILayout.BeginScrollView(scrollPosition);
        
        if (properties != null)
        {
            int index = 0;
            foreach (var kvp in properties)
            {
                DrawComponentProperties(kvp.Key, kvp.Value, index++);
            }
        }

        EditorGUILayout.EndScrollView();
        EditorGUILayout.EndVertical();

        EditorGUILayout.Space();

        using (new EditorGUILayout.HorizontalScope())
        {
            if (GUILayout.Button("Save Properties"))
            {
                SaveProperties();
                Close();
            }
            if (GUILayout.Button("Add Component"))
            {
                ShowAddComponentMenu();
            }
        }
    }

    private void DrawComponentProperties(string componentName, JObject componentData, int index)
    {
        componentFoldouts[index] = EditorGUILayout.Foldout(
            componentFoldouts[index], 
            ObjectNames.NicifyVariableName(Path.GetFileName(componentName))
        );

        if (componentFoldouts[index])
        {
            EditorGUI.indentLevel++;
            foreach (var property in componentData.Properties().ToList())
            {
                DrawProperty(componentData, property);
            }
            EditorGUI.indentLevel--;
        }
    }

    private void DrawProperty(JObject componentData, JProperty property)
    {
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField(ObjectNames.NicifyVariableName(property.Name));

        JToken newValue = DrawPropertyField(property.Value);
        if (newValue != null)
        {
            componentData[property.Name] = newValue;
        }

        EditorGUILayout.EndHorizontal();
    }

    private JToken DrawPropertyField(JToken value)
    {
        switch (value.Type)
        {
            case JTokenType.Boolean:
                return EditorGUILayout.Toggle(value.Value<bool>());
            
            case JTokenType.Integer:
                return EditorGUILayout.IntField(value.Value<int>());
            
            case JTokenType.Float:
                return EditorGUILayout.FloatField(value.Value<float>());
            
            case JTokenType.String:
                return EditorGUILayout.TextField(value.Value<string>());
            
            case JTokenType.Object:
                if (value["x"] != null && value["y"] != null)
                {
                    if (value["z"] != null)
                    {
                        if (value["w"] != null)
                        {
                            Vector4 vec4 = value.ToObject<Vector4>();
                            return JToken.FromObject(EditorGUILayout.Vector4Field("", vec4));
                        }
                        Vector3 vec3 = value.ToObject<Vector3>();
                        return JToken.FromObject(EditorGUILayout.Vector3Field("", vec3));
                    }
                    Vector2 vec2 = value.ToObject<Vector2>();
                    return JToken.FromObject(EditorGUILayout.Vector2Field("", vec2));
                }
                break;
        }

        EditorGUILayout.LabelField(value.ToString());
        return null;
    }

    private void ShowAddComponentMenu()
    {
        var menu = new GenericMenu();
        var assemblies = System.AppDomain.CurrentDomain.GetAssemblies();
        
        foreach (var assembly in assemblies)
        {
            foreach (var type in assembly.GetTypes())
            {
                if (typeof(Component).IsAssignableFrom(type) && !type.IsAbstract)
                {
                    menu.AddItem(
                        new GUIContent(ObjectNames.NicifyVariableName(type.Name)),
                        false,
                        () => AddComponent(type)
                    );
                }
            }
        }
        
        menu.ShowAsContext();
    }

    private void AddComponent(System.Type componentType)
    {
        if (!properties.ContainsKey(componentType.FullName))
        {
            properties[componentType.FullName] = new JObject();
        }
    }

    private void SaveProperties()
    {
        targetObject.property = JsonConvert.SerializeObject(properties, jsonSettings);
    }
}

