/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/


import java.util.*;

// line 74 "diagram.ump"
public abstract class NetworkFileSystemNode
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //NetworkFileSystemNode Attributes
  private string name;
  private string path;

  //NetworkFileSystemNode Associations
  private NetworkNode location;
  private List<NetworkFileSystemNode> parents;
  private List<NetworkFileSystemNode> children;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public NetworkFileSystemNode(string aName, string aPath, NetworkNode aLocation)
  {
    name = aName;
    path = aPath;
    if (!setLocation(aLocation))
    {
      throw new RuntimeException("Unable to create NetworkFileSystemNode due to aLocation");
    }
    parents = new ArrayList<NetworkFileSystemNode>();
    children = new ArrayList<NetworkFileSystemNode>();
  }

  //------------------------
  // INTERFACE
  //------------------------

  public boolean setName(string aName)
  {
    boolean wasSet = false;
    name = aName;
    wasSet = true;
    return wasSet;
  }

  public boolean setPath(string aPath)
  {
    boolean wasSet = false;
    path = aPath;
    wasSet = true;
    return wasSet;
  }

  public string getName()
  {
    return name;
  }

  public string getPath()
  {
    return path;
  }

  public NetworkNode getLocation()
  {
    return location;
  }

  public NetworkFileSystemNode getParent(int index)
  {
    NetworkFileSystemNode aParent = parents.get(index);
    return aParent;
  }

  public List<NetworkFileSystemNode> getParents()
  {
    List<NetworkFileSystemNode> newParents = Collections.unmodifiableList(parents);
    return newParents;
  }

  public int numberOfParents()
  {
    int number = parents.size();
    return number;
  }

  public boolean hasParents()
  {
    boolean has = parents.size() > 0;
    return has;
  }

  public int indexOfParent(NetworkFileSystemNode aParent)
  {
    int index = parents.indexOf(aParent);
    return index;
  }

  public NetworkFileSystemNode getChild(int index)
  {
    NetworkFileSystemNode aChild = children.get(index);
    return aChild;
  }

  public List<NetworkFileSystemNode> getChildren()
  {
    List<NetworkFileSystemNode> newChildren = Collections.unmodifiableList(children);
    return newChildren;
  }

  public int numberOfChildren()
  {
    int number = children.size();
    return number;
  }

  public boolean hasChildren()
  {
    boolean has = children.size() > 0;
    return has;
  }

  public int indexOfChild(NetworkFileSystemNode aChild)
  {
    int index = children.indexOf(aChild);
    return index;
  }

  public boolean setLocation(NetworkNode aNewLocation)
  {
    boolean wasSet = false;
    if (aNewLocation != null)
    {
      location = aNewLocation;
      wasSet = true;
    }
    return wasSet;
  }

  public static int minimumNumberOfParents()
  {
    return 0;
  }

  public boolean addParent(NetworkFileSystemNode aParent)
  {
    boolean wasAdded = false;
    if (parents.contains(aParent)) { return false; }
    if (parents.contains(aParent)) { return false; }
    if (parents.contains(aParent)) { return false; }
    parents.add(aParent);
    if (aParent.indexOfChild(this) != -1)
    {
      wasAdded = true;
    }
    else
    {
      wasAdded = aParent.addChild(this);
      if (!wasAdded)
      {
        parents.remove(aParent);
      }
    }
    return wasAdded;
  }

  public boolean removeParent(NetworkFileSystemNode aParent)
  {
    boolean wasRemoved = false;
    if (!parents.contains(aParent))
    {
      return wasRemoved;
    }

    int oldIndex = parents.indexOf(aParent);
    parents.remove(oldIndex);
    if (aParent.indexOfChild(this) == -1)
    {
      wasRemoved = true;
    }
    else
    {
      wasRemoved = aParent.removeChild(this);
      if (!wasRemoved)
      {
        parents.add(oldIndex,aParent);
      }
    }
    return wasRemoved;
  }

  public boolean addParentAt(NetworkFileSystemNode aParent, int index)
  {  
    boolean wasAdded = false;
    if(addParent(aParent))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfParents()) { index = numberOfParents() - 1; }
      parents.remove(aParent);
      parents.add(index, aParent);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveParentAt(NetworkFileSystemNode aParent, int index)
  {
    boolean wasAdded = false;
    if(parents.contains(aParent))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfParents()) { index = numberOfParents() - 1; }
      parents.remove(aParent);
      parents.add(index, aParent);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addParentAt(aParent, index);
    }
    return wasAdded;
  }

  public static int minimumNumberOfChildren()
  {
    return 0;
  }

  public boolean addChild(NetworkFileSystemNode aChild)
  {
    boolean wasAdded = false;
    if (children.contains(aChild)) { return false; }
    if (children.contains(aChild)) { return false; }
    if (children.contains(aChild)) { return false; }
    children.add(aChild);
    if (aChild.indexOfParent(this) != -1)
    {
      wasAdded = true;
    }
    else
    {
      wasAdded = aChild.addParent(this);
      if (!wasAdded)
      {
        children.remove(aChild);
      }
    }
    return wasAdded;
  }

  public boolean removeChild(NetworkFileSystemNode aChild)
  {
    boolean wasRemoved = false;
    if (!children.contains(aChild))
    {
      return wasRemoved;
    }

    int oldIndex = children.indexOf(aChild);
    children.remove(oldIndex);
    if (aChild.indexOfParent(this) == -1)
    {
      wasRemoved = true;
    }
    else
    {
      wasRemoved = aChild.removeParent(this);
      if (!wasRemoved)
      {
        children.add(oldIndex,aChild);
      }
    }
    return wasRemoved;
  }

  public boolean addChildAt(NetworkFileSystemNode aChild, int index)
  {  
    boolean wasAdded = false;
    if(addChild(aChild))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfChildren()) { index = numberOfChildren() - 1; }
      children.remove(aChild);
      children.add(index, aChild);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveChildAt(NetworkFileSystemNode aChild, int index)
  {
    boolean wasAdded = false;
    if(children.contains(aChild))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfChildren()) { index = numberOfChildren() - 1; }
      children.remove(aChild);
      children.add(index, aChild);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addChildAt(aChild, index);
    }
    return wasAdded;
  }

  public void delete()
  {
    location = null;
    ArrayList<NetworkFileSystemNode> copyOfParents = new ArrayList<NetworkFileSystemNode>(parents);
    parents.clear();
    for(NetworkFileSystemNode aParent : copyOfParents)
    {
      aParent.removeChild(this);
    }
    ArrayList<NetworkFileSystemNode> copyOfChildren = new ArrayList<NetworkFileSystemNode>(children);
    children.clear();
    for(NetworkFileSystemNode aChild : copyOfChildren)
    {
      aChild.removeParent(this);
    }
  }


  public String toString()
  {
	  String outputString = "";
    return super.toString() + "["+ "]" + System.getProperties().getProperty("line.separator") +
            "  " + "name" + "=" + (getName() != null ? !getName().equals(this)  ? getName().toString().replaceAll("  ","    ") : "this" : "null") + System.getProperties().getProperty("line.separator") +
            "  " + "path" + "=" + (getPath() != null ? !getPath().equals(this)  ? getPath().toString().replaceAll("  ","    ") : "this" : "null") + System.getProperties().getProperty("line.separator") +
            "  " + "location = "+(getLocation()!=null?Integer.toHexString(System.identityHashCode(getLocation())):"null")
     + outputString;
  }
}