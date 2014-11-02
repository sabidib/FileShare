/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/



// line 55 "diagram.ump"
public class StreamRequest
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //StreamRequest Associations
  private NetworkFileSystemNode fileRequest;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public StreamRequest(NetworkFileSystemNode aFileRequest)
  {
    if (!setFileRequest(aFileRequest))
    {
      throw new RuntimeException("Unable to create StreamRequest due to aFileRequest");
    }
  }

  //------------------------
  // INTERFACE
  //------------------------

  public NetworkFileSystemNode getFileRequest()
  {
    return fileRequest;
  }

  public boolean setFileRequest(NetworkFileSystemNode aNewFileRequest)
  {
    boolean wasSet = false;
    if (aNewFileRequest != null)
    {
      fileRequest = aNewFileRequest;
      wasSet = true;
    }
    return wasSet;
  }

  public void delete()
  {
    fileRequest = null;
  }

}