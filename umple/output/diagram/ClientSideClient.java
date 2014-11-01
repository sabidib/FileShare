/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/



// line 7 "diagram.ump"
public class ClientSideClient
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //ClientSideClient Associations
  private CentralServer centralServer;
  private ServerSideClient serverSideClient;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public ClientSideClient(CentralServer aCentralServer, ServerSideClient aServerSideClient)
  {
    boolean didAddCentralServer = setCentralServer(aCentralServer);
    if (!didAddCentralServer)
    {
      throw new RuntimeException("Unable to create clientSideClient due to centralServer");
    }
    if (aServerSideClient == null || aServerSideClient.getClientSideClient() != null)
    {
      throw new RuntimeException("Unable to create ClientSideClient due to aServerSideClient");
    }
    serverSideClient = aServerSideClient;
  }

  public ClientSideClient(CentralServer aCentralServer)
  {
    boolean didAddCentralServer = setCentralServer(aCentralServer);
    if (!didAddCentralServer)
    {
      throw new RuntimeException("Unable to create clientSideClient due to centralServer");
    }
    serverSideClient = new ServerSideClient(this);
  }

  //------------------------
  // INTERFACE
  //------------------------

  public CentralServer getCentralServer()
  {
    return centralServer;
  }

  public ServerSideClient getServerSideClient()
  {
    return serverSideClient;
  }

  public boolean setCentralServer(CentralServer aCentralServer)
  {
    boolean wasSet = false;
    if (aCentralServer == null)
    {
      return wasSet;
    }

    CentralServer existingCentralServer = centralServer;
    centralServer = aCentralServer;
    if (existingCentralServer != null && !existingCentralServer.equals(aCentralServer))
    {
      existingCentralServer.removeClientSideClient(this);
    }
    centralServer.addClientSideClient(this);
    wasSet = true;
    return wasSet;
  }

  public void delete()
  {
    CentralServer placeholderCentralServer = centralServer;
    this.centralServer = null;
    placeholderCentralServer.removeClientSideClient(this);
    ServerSideClient existingServerSideClient = serverSideClient;
    serverSideClient = null;
    if (existingServerSideClient != null)
    {
      existingServerSideClient.delete();
    }
  }

}