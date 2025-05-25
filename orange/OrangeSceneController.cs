// Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null
// OrangeSceneController
using UnityEngine;

public abstract class OrangeSceneController : MonoBehaviour
{
	protected virtual void Awake()
	{
		Singleton<GenericEventManager>.Instance.AttachEvent(EventManager.ID.SCENE_INIT, SceneInit);
	}

	protected virtual void OnDisable()
	{
		Singleton<GenericEventManager>.Instance.DetachEvent(EventManager.ID.SCENE_INIT, SceneInit);
	}

	protected abstract void SceneInit();
}
