/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/



// line 44 "diagram.ump"
public class ServerSideClient extends NetworkNode
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //ServerSideClient Associations
  private Client client;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public ServerSideClient(int aIpAddress, Client aClient)
  {
    super(aIpAddress);
    if (aClient == null || aClient.getServerSideClient() != null)
    {
      throw new RuntimeException("Unable to create ServerSideClient due to aClient");
    }
    client = aClient;
  }

  public ServerSideClient(int aIpAddress, int aIpAddressForClient, data aLoginTimeForClient, int aFilesStreamedForClient, int aFilesStreamingForClient, string aProfileImageForClient, CentralServer aCentralServerForClient, Session aSessionForClient, ServerSideClientInformation aServerSideClientInformationForClient)
  {
    super(aIpAddress);
    client = new Client(aIpAddressForClient, aLoginTimeForClient, aFilesStreamedForClient, aFilesStreamingForClient, aProfileImageForClient, aCentralServerForClient, this, aSessionForClient, aServerSideClientInformationForClient);
  }

  //------------------------
  // INTERFACE
  //------------------------

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
    super.delete();
  }

}