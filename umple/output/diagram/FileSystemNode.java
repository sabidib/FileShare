/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/


import java.util.*;

// line 76 "diagram.ump"
public abstract class FileSystemNode
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //FileSystemNode Attributes
  private string name;

  //FileSystemNode Associations
  private List<FileSystemNode> parents;
  private List<FileSystemNode> children;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public FileSystemNode(string aName)
  {
    name = aName;
    parents = new ArrayList<FileSystemNode>();
    children = new ArrayList<FileSystemNode>();
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

  public string getName()
  {
    return name;
  }

  public FileSystemNode getParent(int index)
  {
    FileSystemNode aParent = parents.get(index);
    return aParent;
  }

  public List<FileSystemNode> getParents()
  {
    List<FileSystemNode> newParents = Collections.unmodifiableList(parents);
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

  public int indexOfParent(FileSystemNode aParent)
  {
    int index = parents.indexOf(aParent);
    return index;
  }

  public FileSystemNode getChild(int index)
  {
    FileSystemNode aChild = children.get(index);
    return aChild;
  }

  public List<FileSystemNode> getChildren()
  {
    List<FileSystemNode> newChildren = Collections.unmodifiableList(children);
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

  public int indexOfChild(FileSystemNode aChild)
  {
    int index = children.indexOf(aChild);
    return index;
  }

  public static int minimumNumberOfParents()
  {
    return 0;
  }

  public boolean addParent(FileSystemNode aParent)
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

  public boolean removeParent(FileSystemNode aParent)
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

  public boolean addParentAt(FileSystemNode aParent, int index)
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

  public boolean addOrMoveParentAt(FileSystemNode aParent, int index)
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

  public boolean addChild(FileSystemNode aChild)
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

  public boolean removeChild(FileSystemNode aChild)
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

  public boolean addChildAt(FileSystemNode aChild, int index)
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

  public boolean addOrMoveChildAt(FileSystemNode aChild, int index)
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
    ArrayList<FileSystemNode> copyOfParents = new ArrayList<FileSystemNode>(parents);
    parents.clear();
    for(FileSystemNode aParent : copyOfParents)
    {
      aParent.removeChild(this);
    }
    ArrayList<FileSystemNode> copyOfChildren = new ArrayList<FileSystemNode>(children);
    children.clear();
    for(FileSystemNode aChild : copyOfChildren)
    {
      aChild.removeParent(this);
    }
  }


  public String toString()
  {
	  String outputString = "";
    return super.toString() + "["+ "]" + System.getProperties().getProperty("line.separator") +
            "  " + "name" + "=" + (getName() != null ? !getName().equals(this)  ? getName().toString().replaceAll("  ","    ") : "this" : "null")
     + outputString;
  }
}