/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/


import java.util.*;

// line 2 "ClientSideUmple.ump"
public class Controller
{

  //------------------------
  // STATIC VARIABLES
  //------------------------

  private static Controller theInstance = null;

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //Controller Attributes
  private socket binarySocket;
  private socket socket;
  private String hostname;
  private String port;
  private String currentUsername;
  private List<String> files_currently_sharing;

  //Controller Associations
  private View view;
  private Model model;
  private ShareGroupCreationModal shareGroupCreationModal;
  private ShareGroupModal shareGroupModal;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  private Controller()
  {
    hostname = null;
    port = null;
    currentUsername = null;
    files_currently_sharing = new ArrayList<String>();
  }

  public static Controller getInstance()
  {
    if(theInstance == null)
    {
      theInstance = new Controller();
    }
    return theInstance;
  }

  //------------------------
  // INTERFACE
  //------------------------

  public boolean setBinarySocket(socket aBinarySocket)
  {
    boolean wasSet = false;
    binarySocket = aBinarySocket;
    wasSet = true;
    return wasSet;
  }

  public boolean setSocket(socket aSocket)
  {
    boolean wasSet = false;
    socket = aSocket;
    wasSet = true;
    return wasSet;
  }

  public boolean setHostname(String aHostname)
  {
    boolean wasSet = false;
    hostname = aHostname;
    wasSet = true;
    return wasSet;
  }

  public boolean setPort(String aPort)
  {
    boolean wasSet = false;
    port = aPort;
    wasSet = true;
    return wasSet;
  }

  public boolean setCurrentUsername(String aCurrentUsername)
  {
    boolean wasSet = false;
    currentUsername = aCurrentUsername;
    wasSet = true;
    return wasSet;
  }

  public boolean addFiles_currently_sharing(String aFiles_currently_sharing)
  {
    boolean wasAdded = false;
    wasAdded = files_currently_sharing.add(aFiles_currently_sharing);
    return wasAdded;
  }

  public boolean removeFiles_currently_sharing(String aFiles_currently_sharing)
  {
    boolean wasRemoved = false;
    wasRemoved = files_currently_sharing.remove(aFiles_currently_sharing);
    return wasRemoved;
  }

  public socket getBinarySocket()
  {
    return binarySocket;
  }

  public socket getSocket()
  {
    return socket;
  }

  public String getHostname()
  {
    return hostname;
  }

  public String getPort()
  {
    return port;
  }

  public String getCurrentUsername()
  {
    return currentUsername;
  }

  public String getFiles_currently_sharing(int index)
  {
    String aFiles_currently_sharing = files_currently_sharing.get(index);
    return aFiles_currently_sharing;
  }

  public String[] getFiles_currently_sharing()
  {
    String[] newFiles_currently_sharing = files_currently_sharing.toArray(new String[files_currently_sharing.size()]);
    return newFiles_currently_sharing;
  }

  public int numberOfFiles_currently_sharing()
  {
    int number = files_currently_sharing.size();
    return number;
  }

  public boolean hasFiles_currently_sharing()
  {
    boolean has = files_currently_sharing.size() > 0;
    return has;
  }

  public int indexOfFiles_currently_sharing(String aFiles_currently_sharing)
  {
    int index = files_currently_sharing.indexOf(aFiles_currently_sharing);
    return index;
  }

  public View getView()
  {
    return view;
  }

  public boolean hasView()
  {
    boolean has = view != null;
    return has;
  }

  public Model getModel()
  {
    return model;
  }

  public boolean hasModel()
  {
    boolean has = model != null;
    return has;
  }

  public ShareGroupCreationModal getShareGroupCreationModal()
  {
    return shareGroupCreationModal;
  }

  public boolean hasShareGroupCreationModal()
  {
    boolean has = shareGroupCreationModal != null;
    return has;
  }

  public ShareGroupModal getShareGroupModal()
  {
    return shareGroupModal;
  }

  public boolean hasShareGroupModal()
  {
    boolean has = shareGroupModal != null;
    return has;
  }

  public boolean setView(View aNewView)
  {
    boolean wasSet = false;
    view = aNewView;
    wasSet = true;
    return wasSet;
  }

  public boolean setModel(Model aNewModel)
  {
    boolean wasSet = false;
    model = aNewModel;
    wasSet = true;
    return wasSet;
  }

  public boolean setShareGroupCreationModal(ShareGroupCreationModal aNewShareGroupCreationModal)
  {
    boolean wasSet = false;
    shareGroupCreationModal = aNewShareGroupCreationModal;
    wasSet = true;
    return wasSet;
  }

  public boolean setShareGroupModal(ShareGroupModal aNewShareGroupModal)
  {
    boolean wasSet = false;
    shareGroupModal = aNewShareGroupModal;
    wasSet = true;
    return wasSet;
  }

  public void delete()
  {
    view = null;
    model = null;
    shareGroupCreationModal = null;
    shareGroupModal = null;
  }


  public String toString()
  {
	  String outputString = "";
    return super.toString() + "["+
            "hostname" + ":" + getHostname()+ "," +
            "port" + ":" + getPort()+ "," +
            "currentUsername" + ":" + getCurrentUsername()+ "]" + System.getProperties().getProperty("line.separator") +
            "  " + "binarySocket" + "=" + (getBinarySocket() != null ? !getBinarySocket().equals(this)  ? getBinarySocket().toString().replaceAll("  ","    ") : "this" : "null") + System.getProperties().getProperty("line.separator") +
            "  " + "socket" + "=" + (getSocket() != null ? !getSocket().equals(this)  ? getSocket().toString().replaceAll("  ","    ") : "this" : "null") + System.getProperties().getProperty("line.separator") +
            "  " + "view = "+(getView()!=null?Integer.toHexString(System.identityHashCode(getView())):"null") + System.getProperties().getProperty("line.separator") +
            "  " + "model = "+(getModel()!=null?Integer.toHexString(System.identityHashCode(getModel())):"null") + System.getProperties().getProperty("line.separator") +
            "  " + "shareGroupCreationModal = "+(getShareGroupCreationModal()!=null?Integer.toHexString(System.identityHashCode(getShareGroupCreationModal())):"null") + System.getProperties().getProperty("line.separator") +
            "  " + "shareGroupModal = "+(getShareGroupModal()!=null?Integer.toHexString(System.identityHashCode(getShareGroupModal())):"null")
     + outputString;
  }
}