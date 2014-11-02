/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/



// line 82 "diagram.ump"
public class Stream
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //Stream Associations
  private NetworkNode src;
  private NetworkNode dest;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public Stream(NetworkNode aSrc, NetworkNode aDest)
  {
    if (!setSrc(aSrc))
    {
      throw new RuntimeException("Unable to create Stream due to aSrc");
    }
    if (!setDest(aDest))
    {
      throw new RuntimeException("Unable to create Stream due to aDest");
    }
  }

  //------------------------
  // INTERFACE
  //------------------------

  public NetworkNode getSrc()
  {
    return src;
  }

  public NetworkNode getDest()
  {
    return dest;
  }

  public boolean setSrc(NetworkNode aNewSrc)
  {
    boolean wasSet = false;
    if (aNewSrc != null)
    {
      src = aNewSrc;
      wasSet = true;
    }
    return wasSet;
  }

  public boolean setDest(NetworkNode aNewDest)
  {
    boolean wasSet = false;
    if (aNewDest != null)
    {
      dest = aNewDest;
      wasSet = true;
    }
    return wasSet;
  }

  public void delete()
  {
    src = null;
    dest = null;
  }

}