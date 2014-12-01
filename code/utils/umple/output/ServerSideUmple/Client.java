/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/


import java.util.*;

// line 1 "ServerSideUmple.ump"
public class Client
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //Client Attributes
  private string username;
  private data loginTime;

  //Client Associations
  private Server server;
  private List<ShareGroup> shareGroups;
  private Session session;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public Client(string aUsername, data aLoginTime, Server aServer, Session aSession)
  {
    username = aUsername;
    loginTime = aLoginTime;
    boolean didAddServer = setServer(aServer);
    if (!didAddServer)
    {
      throw new RuntimeException("Unable to create client due to server");
    }
    shareGroups = new ArrayList<ShareGroup>();
    if (aSession == null || aSession.getClient() != null)
    {
      throw new RuntimeException("Unable to create Client due to aSession");
    }
    session = aSession;
  }

  public Client(string aUsername, data aLoginTime, Server aServer, String aSessionIDForSession)
  {
    username = aUsername;
    loginTime = aLoginTime;
    boolean didAddServer = setServer(aServer);
    if (!didAddServer)
    {
      throw new RuntimeException("Unable to create client due to server");
    }
    shareGroups = new ArrayList<ShareGroup>();
    session = new Session(aSessionIDForSession, this);
  }

  //------------------------
  // INTERFACE
  //------------------------

  public boolean setUsername(string aUsername)
  {
    boolean wasSet = false;
    username = aUsername;
    wasSet = true;
    return wasSet;
  }

  public boolean setLoginTime(data aLoginTime)
  {
    boolean wasSet = false;
    loginTime = aLoginTime;
    wasSet = true;
    return wasSet;
  }

  public string getUsername()
  {
    return username;
  }

  public data getLoginTime()
  {
    return loginTime;
  }

  public Server getServer()
  {
    return server;
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

  public Session getSession()
  {
    return session;
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
    ArrayList<ShareGroup> copyOfShareGroups = new ArrayList<ShareGroup>(shareGroups);
    shareGroups.clear();
    for(ShareGroup aShareGroup : copyOfShareGroups)
    {
      aShareGroup.removeClient(this);
    }
    Session existingSession = session;
    session = null;
    if (existingSession != null)
    {
      existingSession.delete();
    }
  }


  public String toString()
  {
	  String outputString = "";
    return super.toString() + "["+ "]" + System.getProperties().getProperty("line.separator") +
            "  " + "username" + "=" + (getUsername() != null ? !getUsername().equals(this)  ? getUsername().toString().replaceAll("  ","    ") : "this" : "null") + System.getProperties().getProperty("line.separator") +
            "  " + "loginTime" + "=" + (getLoginTime() != null ? !getLoginTime().equals(this)  ? getLoginTime().toString().replaceAll("  ","    ") : "this" : "null") + System.getProperties().getProperty("line.separator") +
            "  " + "server = "+(getServer()!=null?Integer.toHexString(System.identityHashCode(getServer())):"null") + System.getProperties().getProperty("line.separator") +
            "  " + "session = "+(getSession()!=null?Integer.toHexString(System.identityHashCode(getSession())):"null")
     + outputString;
  }
}