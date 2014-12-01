/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.20.2.4305 modeling language!*/



// line 19 "ClientSideUmple.ump"
public class Modal
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //Modal Associations
  private Model model;
  private View view;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public Modal(Model aModel, View aView)
  {
    if (!setModel(aModel))
    {
      throw new RuntimeException("Unable to create Modal due to aModel");
    }
    if (!setView(aView))
    {
      throw new RuntimeException("Unable to create Modal due to aView");
    }
  }

  //------------------------
  // INTERFACE
  //------------------------

  public Model getModel()
  {
    return model;
  }

  public View getView()
  {
    return view;
  }

  public boolean setModel(Model aNewModel)
  {
    boolean wasSet = false;
    if (aNewModel != null)
    {
      model = aNewModel;
      wasSet = true;
    }
    return wasSet;
  }

  public boolean setView(View aNewView)
  {
    boolean wasSet = false;
    if (aNewView != null)
    {
      view = aNewView;
      wasSet = true;
    }
    return wasSet;
  }

  public void delete()
  {
    model = null;
    view = null;
  }

}