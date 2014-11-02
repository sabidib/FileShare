/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/


import java.util.*;

// line 39 "diagram.ump"
public class DataFile extends StreamableFile
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public DataFile(string aName, string aPath, NetworkNode aLocation, String aLocation, string aFileType, Client aUploadedBy)
  {
    super(aName, aPath, aLocation, aLocation, aFileType, aUploadedBy);
  }

  //------------------------
  // INTERFACE
  //------------------------

  public void delete()
  {
    super.delete();
  }

}