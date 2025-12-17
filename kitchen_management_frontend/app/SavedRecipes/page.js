
import ClientRecipes from "@/Components/Recipes/Recipes";

export default function SavedRecipes() {
    
  return (
    <div >
        <ClientRecipes endpoint="http://localhost:8080/saved-recipes/ids"/>
    </div>
  );
}
