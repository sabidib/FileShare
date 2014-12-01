/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/



// line 28 "ServerSideUmple.ump"
public class Session
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //Session Attributes
  private String sessionID;

  //Session Associations
  private Client client;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public Session(String aSessionID, Client aClient)
  {
    sessionID = aSessionID;
    if (aClient == null || aClient.getSession() != null)
    {
      throw new RuntimeException("Unable to create Session due to aClient");
    }
    client = aClient;
  }

  public Session(String aSessionID, string aUsernameForClient, data aLoginTimeForClient, Server aServerForClient)
  {
    sessionID = aSessionID;
    client = new Client(aUsernameForClient, aLoginTimeForClient, aServerForClient, this);
  }

  //------------------------
  // INTERFACE
  //------------------------

  public boolean setSessionID(String aSessionID)
  {
    boolean wasSet = false;
    sessionID = aSessionID;
    wasSet = true;
    return wasSet;
  }

  public String getSessionID()
  {
    return sessionID;
  }

  public Client getClient()
  {
    return client;
  }

  public void delete()
  {
    Client existingClient = client;
    client = null;
    if (existingClient != null)
    {
      existingClient.delete();
    }
  }


  public String toString()
  {
	  String outputString = "";
    return super.toString() + "["+
            "sessionID" + ":" + getSessionID()+ "]" + System.getProperties().getProperty("line.separator") +
            "  " + "client = "+(getClient()!=null?Integer.toHexString(System.identityHashCode(getClient())):"null")
     + outputString;
  }
}