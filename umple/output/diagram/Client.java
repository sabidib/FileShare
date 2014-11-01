/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/



// line 3 "diagram.ump"
public class Client extends NetworkNode
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //Client Attributes
  private data loginTime;
  private int filesStreamed;
  private int filesStreaming;
  private string profileImage;

  //Client Associations
  private Server server;
  private Session session;
  private ServerSideClientInformation serverSideClientInformation;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public Client(int aIpAddress, data aLoginTime, int aFilesStreamed, int aFilesStreaming, string aProfileImage, Server aServer, Session aSession, ServerSideClientInformation aServerSideClientInformation)
  {
    super(aIpAddress);
    loginTime = aLoginTime;
    filesStreamed = aFilesStreamed;
    filesStreaming = aFilesStreaming;
    profileImage = aProfileImage;
    boolean didAddServer = setServer(aServer);
    if (!didAddServer)
    {
      throw new RuntimeException("Unable to create client due to server");
    }
    if (!setSession(aSession))
    {
      throw new RuntimeException("Unable to create Client due to aSession");
    }
    if (aServerSideClientInformation == null || aServerSideClientInformation.getClient() != null)
    {
      throw new RuntimeException("Unable to create Client due to aServerSideClientInformation");
    }
    serverSideClientInformation = aServerSideClientInformation;
  }

  public Client(int aIpAddress, data aLoginTime, int aFilesStreamed, int aFilesStreaming, string aProfileImage, Server aServer, Session aSession, int aIpAddressForServerSideClientInformation)
  {
    super(aIpAddress);
    loginTime = aLoginTime;
    filesStreamed = aFilesStreamed;
    filesStreaming = aFilesStreaming;
    profileImage = aProfileImage;
    boolean didAddServer = setServer(aServer);
    if (!didAddServer)
    {
      throw new RuntimeException("Unable to create client due to server");
    }
    session = new Session(null);
    serverSideClientInformation = new ServerSideClientInformation(aIpAddressForServerSideClientInformation, this);
  }

  //------------------------
  // INTERFACE
  //------------------------

  public boolean setLoginTime(data aLoginTime)
  {
    boolean wasSet = false;
    loginTime = aLoginTime;
    wasSet = true;
    return wasSet;
  }

  public boolean setFilesStreamed(int aFilesStreamed)
  {
    boolean wasSet = false;
    filesStreamed = aFilesStreamed;
    wasSet = true;
    return wasSet;
  }

  public boolean setFilesStreaming(int aFilesStreaming)
  {
    boolean wasSet = false;
    filesStreaming = aFilesStreaming;
    wasSet = true;
    return wasSet;
  }

  public boolean setProfileImage(string aProfileImage)
  {
    boolean wasSet = false;
    profileImage = aProfileImage;
    wasSet = true;
    return wasSet;
  }

  public data getLoginTime()
  {
    return loginTime;
  }

  public int getFilesStreamed()
  {
    return filesStreamed;
  }

  public int getFilesStreaming()
  {
    return filesStreaming;
  }

  public string getProfileImage()
  {
    return profileImage;
  }

  public Server getServer()
  {
    return server;
  }

  public Session getSession()
  {
    return session;
  }

  public ServerSideClientInformation getServerSideClientInformation()
  {
    return serverSideClientInformation;
  }

  public boolean setServer(Server aServer)
  {
    boolean wasSet = false;
    if (aServer == null)
    {
      return wasSet;
    }

    Server existingServer = server;
    server = aServer;
    if (existingServer != null && !existingServer.equals(aServer))
    {
      existingServer.removeClient(this);
    }
    server.addClient(this);
    wasSet = true;
    return wasSet;
  }

  public boolean setSession(Session aNewSession)
  {
    boolean wasSet = false;
    if (aNewSession != null)
    {
      session = aNewSession;
      wasSet = true;
    }
    return wasSet;
  }

  public void delete()
  {
    Server placeholderServer = server;
    this.server = null;
    placeholderServer.removeClient(this);
    session = null;
    ServerSideClientInformation existingServerSideClientInformation = serverSideClientInformation;
    serverSideClientInformation = null;
    if (existingServerSideClientInformation != null)
    {
      existingServerSideClientInformation.delete();
    }
    super.delete();
  }


  public String toString()
  {
	  String outputString = "";
    return super.toString() + "["+
            "filesStreamed" + ":" + getFilesStreamed()+ "," +
            "filesStreaming" + ":" + getFilesStreaming()+ "]" + System.getProperties().getProperty("line.separator") +
            "  " + "loginTime" + "=" + (getLoginTime() != null ? !getLoginTime().equals(this)  ? getLoginTime().toString().replaceAll("  ","    ") : "this" : "null") + System.getProperties().getProperty("line.separator") +
            "  " + "profileImage" + "=" + (getProfileImage() != null ? !getProfileImage().equals(this)  ? getProfileImage().toString().replaceAll("  ","    ") : "this" : "null") + System.getProperties().getProperty("line.separator") +
            "  " + "server = "+(getServer()!=null?Integer.toHexString(System.identityHashCode(getServer())):"null") + System.getProperties().getProperty("line.separator") +
            "  " + "session = "+(getSession()!=null?Integer.toHexString(System.identityHashCode(getSession())):"null") + System.getProperties().getProperty("line.separator") +
            "  " + "serverSideClientInformation = "+(getServerSideClientInformation()!=null?Integer.toHexString(System.identityHashCode(getServerSideClientInformation())):"null")
     + outputString;
  }  
  //------------------------
  // DEVELOPER CODE - PROVIDED AS-IS
  //------------------------
  
  // line 8 diagram.ump
  ServerSideClientInformation
	string username ;

  
}