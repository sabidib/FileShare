/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/



// line 45 "ClientSideUmple.ump"
public class Stream
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //Stream Attributes
  private String source;
  private String destination;
  private String fileID;
  private String download;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public Stream(String aSource, String aDestination, String aFileID, String aDownload)
  {
    source = aSource;
    destination = aDestination;
    fileID = aFileID;
    download = aDownload;
  }

  //------------------------
  // INTERFACE
  //------------------------

  public boolean setSource(String aSource)
  {
    boolean wasSet = false;
    source = aSource;
    wasSet = true;
    return wasSet;
  }

  public boolean setDestination(String aDestination)
  {
    boolean wasSet = false;
    destination = aDestination;
    wasSet = true;
    return wasSet;
  }

  public boolean setFileID(String aFileID)
  {
    boolean wasSet = false;
    fileID = aFileID;
    wasSet = true;
    return wasSet;
  }

  public boolean setDownload(String aDownload)
  {
    boolean wasSet = false;
    download = aDownload;
    wasSet = true;
    return wasSet;
  }

  public String getSource()
  {
    return source;
  }

  public String getDestination()
  {
    return destination;
  }

  public String getFileID()
  {
    return fileID;
  }

  public String getDownload()
  {
    return download;
  }

  public void delete()
  {}


  public String toString()
  {
	  String outputString = "";
    return super.toString() + "["+
            "source" + ":" + getSource()+ "," +
            "destination" + ":" + getDestination()+ "," +
            "fileID" + ":" + getFileID()+ "," +
            "download" + ":" + getDownload()+ "]"
     + outputString;
  }
}