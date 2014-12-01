/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/



// line 8 "ServerSideUmple.ump"
public class File
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //File Attributes
  private int id;
  private String fileType;
  private String name;
  private String location;

  //File Associations
  private Client uploadedBy;
  private ShareGroup shareGroup;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public File(int aId, String aFileType, String aName, String aLocation, Client aUploadedBy)
  {
    id = aId;
    fileType = aFileType;
    name = aName;
    location = aLocation;
    if (!setUploadedBy(aUploadedBy))
    {
      throw new RuntimeException("Unable to create File due to aUploadedBy");
    }
  }

  //------------------------
  // INTERFACE
  //------------------------

  public boolean setId(int aId)
  {
    boolean wasSet = false;
    id = aId;
    wasSet = true;
    return wasSet;
  }

  public boolean setFileType(String aFileType)
  {
    boolean wasSet = false;
    fileType = aFileType;
    wasSet = true;
    return wasSet;
  }

  public boolean setName(String aName)
  {
    boolean wasSet = false;
    name = aName;
    wasSet = true;
    return wasSet;
  }

  public boolean setLocation(String aLocation)
  {
    boolean wasSet = false;
    location = aLocation;
    wasSet = true;
    return wasSet;
  }

  public int getId()
  {
    return id;
  }

  public String getFileType()
  {
    return fileType;
  }

  public String getName()
  {
    return name;
  }

  public String getLocation()
  {
    return location;
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
  }


  public String toString()
  {
	  String outputString = "";
    return super.toString() + "["+
            "id" + ":" + getId()+ "," +
            "fileType" + ":" + getFileType()+ "," +
            "name" + ":" + getName()+ "," +
            "location" + ":" + getLocation()+ "]" + System.getProperties().getProperty("line.separator") +
            "  " + "uploadedBy = "+(getUploadedBy()!=null?Integer.toHexString(System.identityHashCode(getUploadedBy())):"null") + System.getProperties().getProperty("line.separator") +
            "  " + "shareGroup = "+(getShareGroup()!=null?Integer.toHexString(System.identityHashCode(getShareGroup())):"null")
     + outputString;
  }
}