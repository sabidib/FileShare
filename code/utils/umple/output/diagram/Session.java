/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/



// line 51 "diagram.ump"
public class Session
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //Session Attributes
  private String folderStored;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public Session(String aFolderStored)
  {
    folderStored = aFolderStored;
  }

  //------------------------
  // INTERFACE
  //------------------------

  public boolean setFolderStored(String aFolderStored)
  {
    boolean wasSet = false;
    folderStored = aFolderStored;
    wasSet = true;
    return wasSet;
  }

  public String getFolderStored()
  {
    return folderStored;
  }

  public void delete()
  {}


  public String toString()
  {
	  String outputString = "";
    return super.toString() + "["+
            "folderStored" + ":" + getFolderStored()+ "]"
     + outputString;
  }
}