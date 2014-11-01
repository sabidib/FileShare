/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/



// line 16 "diagram.ump"
public abstract class NetworkNode
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //NetworkNode Attributes
  private int ipAddress;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public NetworkNode(int aIpAddress)
  {
    ipAddress = aIpAddress;
  }

  //------------------------
  // INTERFACE
  //------------------------

  public boolean setIpAddress(int aIpAddress)
  {
    boolean wasSet = false;
    ipAddress = aIpAddress;
    wasSet = true;
    return wasSet;
  }

  public int getIpAddress()
  {
    return ipAddress;
  }

  public void delete()
  {}


  public String toString()
  {
	  String outputString = "";
    return super.toString() + "["+
            "ipAddress" + ":" + getIpAddress()+ "]"
     + outputString;
  }
}