/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/



// line 32 "ClientSideUmple.ump"
public class StreamRequest
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //StreamRequest Attributes
  private String streamRequestSource;
  private String fileID;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public StreamRequest(String aStreamRequestSource, String aFileID)
  {
    streamRequestSource = aStreamRequestSource;
    fileID = aFileID;
  }

  //------------------------
  // INTERFACE
  //------------------------

  public boolean setStreamRequestSource(String aStreamRequestSource)
  {
    boolean wasSet = false;
    streamRequestSource = aStreamRequestSource;
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

  public String getStreamRequestSource()
  {
    return streamRequestSource;
  }

  public String getFileID()
  {
    return fileID;
  }

  public void delete()
  {}


  public String toString()
  {
	  String outputString = "";
    return super.toString() + "["+
            "streamRequestSource" + ":" + getStreamRequestSource()+ "," +
            "fileID" + ":" + getFileID()+ "]"
     + outputString;
  }
}