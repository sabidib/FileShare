/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/



// line 38 "ClientSideUmple.ump"
public class View
{

  //------------------------
  // STATIC VARIABLES
  //------------------------

  private static View theInstance = null;

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //------------------------
  // CONSTRUCTOR
  //------------------------

  private View()
  {}

  public static View getInstance()
  {
    if(theInstance == null)
    {
      theInstance = new View();
    }
    return theInstance;
  }

  //------------------------
  // INTERFACE
  //------------------------

  public void delete()
  {}

}