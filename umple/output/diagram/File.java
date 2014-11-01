/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/


import java.util.*;

// line 22 "diagram.ump"
// line 70 "diagram.ump"
public class File extends NetworkFileSystemNode
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //File Attributes
  private String location;
  private string fileType;

  //File Associations
  private Client client;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public File(string aName, string aPath, NetworkNode aLocation, String aLocation, string aFileType, Client aClient)
  {
    super(aName, aPath, aLocation);
    location = aLocation;
    fileType = aFileType;
    if (!setClient(aClient))
    {
      throw new RuntimeException("Unable to create File due to aClient");
    }
  }

  //------------------------
  // INTERFACE
  //------------------------

  public boolean setLocation(String aLocation)
  {
    boolean wasSet = false;
    location = aLocation;
    wasSet = true;
    return wasSet;
  }

  public boolean setFileType(string aFileType)
  {
    boolean wasSet = false;
    fileType = aFileType;
    wasSet = true;
    return wasSet;
  }

  public String getLocation()
  {
    return location;
  }

  public string getFileType()
  {
    return fileType;
  }

  public Client getClient()
  {
    return client;
  }

  public boolean setClient(Client aNewClient)
  {
    boolean wasSet = false;
    if (aNewClient != null)
    {
      client = aNewClient;
      wasSet = true;
    }
    return wasSet;
  }

  public void delete()
  {
    client = null;
    super.delete();
  }


  public String toString()
  {
	  String outputString = "";
    return super.toString() + "["+
            "location" + ":" + getLocation()+ "]" + System.getProperties().getProperty("line.separator") +
            "  " + "fileType" + "=" + (getFileType() != null ? !getFileType().equals(this)  ? getFileType().toString().replaceAll("  ","    ") : "this" : "null") + System.getProperties().getProperty("line.separator") +
            "  " + "client = "+(getClient()!=null?Integer.toHexString(System.identityHashCode(getClient())):"null")
     + outputString;
  }
}