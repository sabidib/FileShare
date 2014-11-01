/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/


import java.util.*;

// line 60 "diagram.ump"
public class ServerSideClientInformation
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //ServerSideClientInformation Attributes
  private int ipAddress;

  //ServerSideClientInformation Associations
  private List<NetworkFileSystemNode> networkFileSystemNodes;
  private Client client;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public ServerSideClientInformation(int aIpAddress, Client aClient)
  {
    ipAddress = aIpAddress;
    networkFileSystemNodes = new ArrayList<NetworkFileSystemNode>();
    if (aClient == null || aClient.getServerSideClientInformation() != null)
    {
      throw new RuntimeException("Unable to create ServerSideClientInformation due to aClient");
    }
    client = aClient;
  }

  public ServerSideClientInformation(int aIpAddress, int aIpAddressForClient, data aLoginTimeForClient, int aFilesStreamedForClient, int aFilesStreamingForClient, string aProfileImageForClient, Server aServerForClient, Session aSessionForClient)
  {
    ipAddress = aIpAddress;
    networkFileSystemNodes = new ArrayList<NetworkFileSystemNode>();
    client = new Client(aIpAddressForClient, aLoginTimeForClient, aFilesStreamedForClient, aFilesStreamingForClient, aProfileImageForClient, aServerForClient, aSessionForClient, this);
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

  public NetworkFileSystemNode getNetworkFileSystemNode(int index)
  {
    NetworkFileSystemNode aNetworkFileSystemNode = networkFileSystemNodes.get(index);
    return aNetworkFileSystemNode;
  }

  public List<NetworkFileSystemNode> getNetworkFileSystemNodes()
  {
    List<NetworkFileSystemNode> newNetworkFileSystemNodes = Collections.unmodifiableList(networkFileSystemNodes);
    return newNetworkFileSystemNodes;
  }

  public int numberOfNetworkFileSystemNodes()
  {
    int number = networkFileSystemNodes.size();
    return number;
  }

  public boolean hasNetworkFileSystemNodes()
  {
    boolean has = networkFileSystemNodes.size() > 0;
    return has;
  }

  public int indexOfNetworkFileSystemNode(NetworkFileSystemNode aNetworkFileSystemNode)
  {
    int index = networkFileSystemNodes.indexOf(aNetworkFileSystemNode);
    return index;
  }

  public Client getClient()
  {
    return client;
  }

  public static int minimumNumberOfNetworkFileSystemNodes()
  {
    return 0;
  }

  public boolean addNetworkFileSystemNode(NetworkFileSystemNode aNetworkFileSystemNode)
  {
    boolean wasAdded = false;
    if (networkFileSystemNodes.contains(aNetworkFileSystemNode)) { return false; }
    networkFileSystemNodes.add(aNetworkFileSystemNode);
    wasAdded = true;
    return wasAdded;
  }

  public boolean removeNetworkFileSystemNode(NetworkFileSystemNode aNetworkFileSystemNode)
  {
    boolean wasRemoved = false;
    if (networkFileSystemNodes.contains(aNetworkFileSystemNode))
    {
      networkFileSystemNodes.remove(aNetworkFileSystemNode);
      wasRemoved = true;
    }
    return wasRemoved;
  }

  public boolean addNetworkFileSystemNodeAt(NetworkFileSystemNode aNetworkFileSystemNode, int index)
  {  
    boolean wasAdded = false;
    if(addNetworkFileSystemNode(aNetworkFileSystemNode))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfNetworkFileSystemNodes()) { index = numberOfNetworkFileSystemNodes() - 1; }
      networkFileSystemNodes.remove(aNetworkFileSystemNode);
      networkFileSystemNodes.add(index, aNetworkFileSystemNode);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveNetworkFileSystemNodeAt(NetworkFileSystemNode aNetworkFileSystemNode, int index)
  {
    boolean wasAdded = false;
    if(networkFileSystemNodes.contains(aNetworkFileSystemNode))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfNetworkFileSystemNodes()) { index = numberOfNetworkFileSystemNodes() - 1; }
      networkFileSystemNodes.remove(aNetworkFileSystemNode);
      networkFileSystemNodes.add(index, aNetworkFileSystemNode);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addNetworkFileSystemNodeAt(aNetworkFileSystemNode, index);
    }
    return wasAdded;
  }

  public void delete()
  {
    networkFileSystemNodes.clear();
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
            "ipAddress" + ":" + getIpAddress()+ "]" + System.getProperties().getProperty("line.separator") +
            "  " + "client = "+(getClient()!=null?Integer.toHexString(System.identityHashCode(getClient())):"null")
     + outputString;
  }
}