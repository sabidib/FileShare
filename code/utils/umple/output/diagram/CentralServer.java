/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/


import java.util.*;

// line 48 "diagram.ump"
public class CentralServer extends NetworkNode
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //CentralServer Associations
  private List<Client> clients;
  private DatabaseConnection databaseConnection;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public CentralServer(int aIpAddress, DatabaseConnection aDatabaseConnection)
  {
    super(aIpAddress);
    clients = new ArrayList<Client>();
    if (!setDatabaseConnection(aDatabaseConnection))
    {
      throw new RuntimeException("Unable to create CentralServer due to aDatabaseConnection");
    }
  }

  //------------------------
  // INTERFACE
  //------------------------

  public Client getClient(int index)
  {
    Client aClient = clients.get(index);
    return aClient;
  }

  public List<Client> getClients()
  {
    List<Client> newClients = Collections.unmodifiableList(clients);
    return newClients;
  }

  public int numberOfClients()
  {
    int number = clients.size();
    return number;
  }

  public boolean hasClients()
  {
    boolean has = clients.size() > 0;
    return has;
  }

  public int indexOfClient(Client aClient)
  {
    int index = clients.indexOf(aClient);
    return index;
  }

  public DatabaseConnection getDatabaseConnection()
  {
    return databaseConnection;
  }

  public static int minimumNumberOfClients()
  {
    return 0;
  }

  public Client addClient(int aIpAddress, data aLoginTime, int aFilesStreamed, int aFilesStreaming, string aProfileImage, ServerSideClient aServerSideClient, Session aSession, ServerSideClientInformation aServerSideClientInformation)
  {
    return new Client(aIpAddress, aLoginTime, aFilesStreamed, aFilesStreaming, aProfileImage, this, aServerSideClient, aSession, aServerSideClientInformation);
  }

  public boolean addClient(Client aClient)
  {
    boolean wasAdded = false;
    if (clients.contains(aClient)) { return false; }
    CentralServer existingCentralServer = aClient.getCentralServer();
    boolean isNewCentralServer = existingCentralServer != null && !this.equals(existingCentralServer);
    if (isNewCentralServer)
    {
      aClient.setCentralServer(this);
    }
    else
    {
      clients.add(aClient);
    }
    wasAdded = true;
    return wasAdded;
  }

  public boolean removeClient(Client aClient)
  {
    boolean wasRemoved = false;
    //Unable to remove aClient, as it must always have a centralServer
    if (!this.equals(aClient.getCentralServer()))
    {
      clients.remove(aClient);
      wasRemoved = true;
    }
    return wasRemoved;
  }

  public boolean addClientAt(Client aClient, int index)
  {  
    boolean wasAdded = false;
    if(addClient(aClient))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfClients()) { index = numberOfClients() - 1; }
      clients.remove(aClient);
      clients.add(index, aClient);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveClientAt(Client aClient, int index)
  {
    boolean wasAdded = false;
    if(clients.contains(aClient))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfClients()) { index = numberOfClients() - 1; }
      clients.remove(aClient);
      clients.add(index, aClient);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addClientAt(aClient, index);
    }
    return wasAdded;
  }

  public boolean setDatabaseConnection(DatabaseConnection aNewDatabaseConnection)
  {
    boolean wasSet = false;
    if (aNewDatabaseConnection != null)
    {
      databaseConnection = aNewDatabaseConnection;
      wasSet = true;
    }
    return wasSet;
  }

  public void delete()
  {
    for(int i=clients.size(); i > 0; i--)
    {
      Client aClient = clients.get(i - 1);
      aClient.delete();
    }
    databaseConnection = null;
    super.delete();
  }

}