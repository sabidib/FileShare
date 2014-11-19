/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/


import java.util.*;

// line 22 "diagram.ump"
// line 69 "diagram.ump"
public class File extends NetworkFileSystemNode
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //File Attributes
  private String location;
  private string fileType;

  //File Associations
  private Client uploadedBy;
  private ShareGroup shareGroup;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public File(string aName, string aPath, NetworkNode aLocation, String aLocation, string aFileType, Client aUploadedBy)
  {
    super(aName, aPath, aLocation);
    location = aLocation;
    fileType = aFileType;
    if (!setUploadedBy(aUploadedBy))
    {
      throw new RuntimeException("Unable to create File due to aUploadedBy");
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

  public Client getUploadedBy()
  {
    return uploadedBy;
  }

  public ShareGroup getShareGroup()
  {
    return shareGroup;
  }

  public boolean hasShareGroup()
  {
    boolean has = shareGroup != null;
    return has;
  }

  public boolean setUploadedBy(Client aNewUploadedBy)
  {
    boolean wasSet = false;
    if (aNewUploadedBy != null)
    {
      uploadedBy = aNewUploadedBy;
      wasSet = true;
    }
    return wasSet;
  }

  public boolean setShareGroup(ShareGroup aShareGroup)
  {
    boolean wasSet = false;
    ShareGroup existingShareGroup = shareGroup;
    shareGroup = aShareGroup;
    if (existingShareGroup != null && !existingShareGroup.equals(aShareGroup))
    {
      existingShareGroup.removeFile(this);
    }
    if (aShareGroup != null)
    {
      aShareGroup.addFile(this);
    }
    wasSet = true;
    return wasSet;
  }

  public void delete()
  {
    uploadedBy = null;
    if (shareGroup != null)
    {
      ShareGroup placeholderShareGroup = shareGroup;
      this.shareGroup = null;
      placeholderShareGroup.removeFile(this);
    }
    super.delete();
  }


  public String toString()
  {
	  String outputString = "";
    return super.toString() + "["+
            "location" + ":" + getLocation()+ "]" + System.getProperties().getProperty("line.separator") +
            "  " + "fileType" + "=" + (getFileType() != null ? !getFileType().equals(this)  ? getFileType().toString().replaceAll("  ","    ") : "this" : "null") + System.getProperties().getProperty("line.separator") +
            "  " + "uploadedBy = "+(getUploadedBy()!=null?Integer.toHexString(System.identityHashCode(getUploadedBy())):"null") + System.getProperties().getProperty("line.separator") +
            "  " + "shareGroup = "+(getShareGroup()!=null?Integer.toHexString(System.identityHashCode(getShareGroup())):"null")
     + outputString;
  }
}