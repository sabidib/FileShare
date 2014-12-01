/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/



// line 42 "ClientSideUmple.ump"
public class Model
{

  //------------------------
  // STATIC VARIABLES
  //------------------------

  private static Model theInstance = null;

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //------------------------
  // CONSTRUCTOR
  //------------------------

  private Model()
  {}

  public static Model getInstance()
  {
    if(theInstance == null)
    {
      theInstance = new Model();
    }
    return theInstance;
  }

  //------------------------
  // INTERFACE
  //------------------------

  public void delete()
  {}

}