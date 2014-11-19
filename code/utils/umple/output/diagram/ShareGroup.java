/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/


import java.util.*;

// line 87 "diagram.ump"
public class ShareGroup
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //ShareGroup Attributes
  private int numberOfClients;
  private int numberOfFiles;

  //ShareGroup Associations
  private List<File> files;
  private List<Client> clients;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public ShareGroup(int aNumberOfClients, int aNumberOfFiles)
  {
    numberOfClients = aNumberOfClients;
    numberOfFiles = aNumberOfFiles;
    files = new ArrayList<File>();
    clients = new ArrayList<Client>();
  }

  //------------------------
  // INTERFACE
  //------------------------

  public boolean setNumberOfClients(int aNumberOfClients)
  {
    boolean wasSet = false;
    numberOfClients = aNumberOfClients;
    wasSet = true;
    return wasSet;
  }

  public boolean setNumberOfFiles(int aNumberOfFiles)
  {
    boolean wasSet = false;
    numberOfFiles = aNumberOfFiles;
    wasSet = true;
    return wasSet;
  }

  public int getNumberOfClients()
  {
    return numberOfClients;
  }

  public int getNumberOfFiles()
  {
    return numberOfFiles;
  }

  public File getFile(int index)
  {
    File aFile = files.get(index);
    return aFile;
  }

  public List<File> getFiles()
  {
    List<File> newFiles = Collections.unmodifiableList(files);
    return newFiles;
  }

  public int numberOfFiles()
  {
    int number = files.size();
    return number;
  }

  public boolean hasFiles()
  {
    boolean has = files.size() > 0;
    return has;
  }

  public int indexOfFile(File aFile)
  {
    int index = files.indexOf(aFile);
    return index;
  }

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

  public static int minimumNumberOfFiles()
  {
    return 0;
  }

  public boolean addFile(File aFile)
  {
    boolean wasAdded = false;
    if (files.contains(aFile)) { return false; }
    ShareGroup existingShareGroup = aFile.getShareGroup();
    if (existingShareGroup == null)
    {
      aFile.setShareGroup(this);
    }
    else if (!this.equals(existingShareGroup))
    {
      existingShareGroup.removeFile(aFile);
      addFile(aFile);
    }
    else
    {
      files.add(aFile);
    }
    wasAdded = true;
    return wasAdded;
  }

  public boolean removeFile(File aFile)
  {
    boolean wasRemoved = false;
    if (files.contains(aFile))
    {
      files.remove(aFile);
      aFile.setShareGroup(null);
      wasRemoved = true;
    }
    return wasRemoved;
  }

  public boolean addFileAt(File aFile, int index)
  {  
    boolean wasAdded = false;
    if(addFile(aFile))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfFiles()) { index = numberOfFiles() - 1; }
      files.remove(aFile);
      files.add(index, aFile);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveFileAt(File aFile, int index)
  {
    boolean wasAdded = false;
    if(files.contains(aFile))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfFiles()) { index = numberOfFiles() - 1; }
      files.remove(aFile);
      files.add(index, aFile);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addFileAt(aFile, index);
    }
    return wasAdded;
  }

  public static int minimumNumberOfClients()
  {
    return 0;
  }

  public boolean addClient(Client aClient)
  {
    boolean wasAdded = false;
    if (clients.contains(aClient)) { return false; }
    clients.add(aClient);
    if (aClient.indexOfShareGroup(this) != -1)
    {
      wasAdded = true;
    }
    else
    {
      wasAdded = aClient.addShareGroup(this);
      if (!wasAdded)
      {
        clients.remove(aClient);
      }
    }
    return wasAdded;
  }

  public boolean removeClient(Client aClient)
  {
    boolean wasRemoved = false;
    if (!clients.contains(aClient))
    {
      return wasRemoved;
    }

    int oldIndex = clients.indexOf(aClient);
    clients.remove(oldIndex);
    if (aClient.indexOfShareGroup(this) == -1)
    {
      wasRemoved = true;
    }
    else
    {
      wasRemoved = aClient.removeShareGroup(this);
      if (!wasRemoved)
      {
        clients.add(oldIndex,aClient);
      }
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

  public void delete()
  {
    while( !files.isEmpty() )
    {
      files.get(0).setShareGroup(null);
    }
    ArrayList<Client> copyOfClients = new ArrayList<Client>(clients);
    clients.clear();
    for(Client aClient : copyOfClients)
    {
      aClient.removeShareGroup(this);
    }
  }


  public String toString()
  {
	  String outputString = "";
    return super.toString() + "["+
            "numberOfClients" + ":" + getNumberOfClients()+ "," +
            "numberOfFiles" + ":" + getNumberOfFiles()+ "]"
     + outputString;
  }
}