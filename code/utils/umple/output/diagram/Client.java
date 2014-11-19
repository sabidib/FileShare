/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/


import java.util.*;

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
  private List<ShareGroup> shareGroups;

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
    shareGroups = new ArrayList<ShareGroup>();
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
    shareGroups = new ArrayList<ShareGroup>();
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

  public ShareGroup getShareGroup(int index)
  {
    ShareGroup aShareGroup = shareGroups.get(index);
    return aShareGroup;
  }

  public List<ShareGroup> getShareGroups()
  {
    List<ShareGroup> newShareGroups = Collections.unmodifiableList(shareGroups);
    return newShareGroups;
  }

  public int numberOfShareGroups()
  {
    int number = shareGroups.size();
    return number;
  }

  public boolean hasShareGroups()
  {
    boolean has = shareGroups.size() > 0;
    return has;
  }

  public int indexOfShareGroup(ShareGroup aShareGroup)
  {
    int index = shareGroups.indexOf(aShareGroup);
    return index;
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

  public static int minimumNumberOfShareGroups()
  {
    return 0;
  }

  public boolean addShareGroup(ShareGroup aShareGroup)
  {
    boolean wasAdded = false;
    if (shareGroups.contains(aShareGroup)) { return false; }
    shareGroups.add(aShareGroup);
    if (aShareGroup.indexOfClient(this) != -1)
    {
      wasAdded = true;
    }
    else
    {
      wasAdded = aShareGroup.addClient(this);
      if (!wasAdded)
      {
        shareGroups.remove(aShareGroup);
      }
    }
    return wasAdded;
  }

  public boolean removeShareGroup(ShareGroup aShareGroup)
  {
    boolean wasRemoved = false;
    if (!shareGroups.contains(aShareGroup))
    {
      return wasRemoved;
    }

    int oldIndex = shareGroups.indexOf(aShareGroup);
    shareGroups.remove(oldIndex);
    if (aShareGroup.indexOfClient(this) == -1)
    {
      wasRemoved = true;
    }
    else
    {
      wasRemoved = aShareGroup.removeClient(this);
      if (!wasRemoved)
      {
        shareGroups.add(oldIndex,aShareGroup);
      }
    }
    return wasRemoved;
  }

  public boolean addShareGroupAt(ShareGroup aShareGroup, int index)
  {  
    boolean wasAdded = false;
    if(addShareGroup(aShareGroup))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfShareGroups()) { index = numberOfShareGroups() - 1; }
      shareGroups.remove(aShareGroup);
      shareGroups.add(index, aShareGroup);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveShareGroupAt(ShareGroup aShareGroup, int index)
  {
    boolean wasAdded = false;
    if(shareGroups.contains(aShareGroup))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfShareGroups()) { index = numberOfShareGroups() - 1; }
      shareGroups.remove(aShareGroup);
      shareGroups.add(index, aShareGroup);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addShareGroupAt(aShareGroup, index);
    }
    return wasAdded;
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
    ArrayList<ShareGroup> copyOfShareGroups = new ArrayList<ShareGroup>(shareGroups);
    shareGroups.clear();
    for(ShareGroup aShareGroup : copyOfShareGroups)
    {
      aShareGroup.removeClient(this);
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
  
  // line 9 diagram.ump
  ServerSideClientInformation
	string username ;

  
}