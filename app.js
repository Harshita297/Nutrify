//FUNCTION 01 GET NUTRIENT INFORMATION-------------------------------------------------->

const appId1 = 'e421fc8c'
const apiKey1 = "dfc4d22cd6f14fb415b60737b3d062f3"

const inputNutrientSearch = document.getElementById('nutrientSearch').value
const nutrientsearchButton = document.getElementById('nutrientInputButton')
const nutrientInfo = document.querySelector(".nutrientInformation")
const nutrientResult = document.getElementById("information")

nutrientsearchButton.addEventListener('click', searchFood)


async function searchFood(){
  const inputNutrientSearch = document.getElementById('nutrientSearch').value


var options = {
  'method': 'POST',
  'url': 'https://trackapi.nutritionix.com/v2/natural/nutrients',
  'headers': {
    'Content-Type': 'application/json',
    'x-app-id': appId1,
    'x-app-key': apiKey1,
  },
  body: JSON.stringify({
    "query": inputNutrientSearch
  })
}

const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', options)
const data =  await response.json()

const informationDisplay = data.foods.map(food=> {
  return {
    name: food.food_name,
    serving_size: food.serving_qty + ' ' + food.serving_unit,
    calories: food.nf_calories,
        total_fat: food.nf_total_fat,
        cholesterol: food.nf_cholesterol,
        sodium: food.nf_sodium,
        total_carbohydrate: food.nf_total_carbohydrate,
        dietary_fiber: food.nf_dietary_fiber,
        sugars: food.nf_sugars,
        protein: food.nf_protein
      };
    });
    
    
     const arr = informationDisplay[0]
     nutrientResult.innerHTML =  `<p> <br>${arr.name}</br> 
     <br> Serving_size: ${arr.serving_size} </br>
     <br> Calories: ${arr.calories} Kcal</br>
     <br> Total_fat: ${arr.total_fat} g</br>
     <br> Cholesterol: ${arr.cholesterol}mg </br>
     <br> Sodium: ${arr.sodium} mg</br>
     <br> Total_carbohydrate:  ${arr.total_carbohydrate} g</br>
     <br> Dietary_fiber ${arr.dietary_fiber}mg </br>
     <br> Sugars: ${arr.sugars}g </br>
      <br> Protien:  ${arr.protein}g </br><\p>`
  }
 
//FUNCTION 1 ENDS HERE ------------------------------------------------------------------>

//FUNCTION 2 GET RECIPIES BASED ON INGREDIENTS



const searchButtton = document.getElementById('inputButton')
const container = document.getElementById('container')
const nutrientInformation = document.querySelector('.nutrientInformation')
const main = document.getElementById('main')
let recipeDetailsArray

const apikey2 = '4bb79c4afd334c9c990d3d9f2b8d6525'
const BASE_URL = 'https://api.spoonacular.com'

async function getRecipesByIngredients(ingredients, number = 5) {
  const endpoint = `${BASE_URL}/recipes/findByIngredients`;
  const url = new URL(endpoint);
  url.searchParams.append('ingredients', ingredients.join(','));
  url.searchParams.append('number', number);
  url.searchParams.append('apiKey', apikey2);
  
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json()
      return data || []
  } catch (error) {
      console.error('Error fetching recipes:', error);
      return [];
  }
}

async function getRecipeDetails(id) {
  const endpoint = `${BASE_URL}/recipes/${id}/information`;
  const url = new URL(endpoint);
  url.searchParams.append('apiKey', apikey2);
  
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data || {};
  } catch (error) {
      console.error('Error fetching recipe details:', error);
      return {};
  }
}


searchButtton.addEventListener('click', getRecipes)

async function getRecipes() {
  const ingredientSearch = document.getElementById('search').value
  ingredients = ingredientSearch.split(',').map(ingredient => ingredient.trim())
  
  const recipes = await getRecipesByIngredients(ingredients)
  displayRecipes(recipes)
 
}

function displayRecipes(recipes){
  main.innerHTML = ''
  const recipesDiv = document.createElement('div')
  recipesDiv.innerHTML = ''

  recipes.forEach(async recipe => {
    const details = await getRecipeDetails(recipe.id);
    const recipeElement = document.createElement('div');
    recipeElement.classList.add('recipe');

    const title = document.createElement('h2');
    title.textContent = details.title;

    const image = document.createElement('img');
    image.src = details.image;

    const ingredientsList = document.createElement('ul');
    details.extendedIngredients.forEach(ingredient => {
    const li = document.createElement('li');
    li.textContent = ingredient.original;
    ingredientsList.appendChild(li);
  });

  const instructions = document.createElement('ol')
  if (details.analyzedInstructions.length > 0) {
    details.analyzedInstructions[0].steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step.step;
        instructions.appendChild(li);
    });
} else {
    const li = document.createElement('li');
    li.textContent = 'No instructions available.';
    instructions.appendChild(li);
}
  recipeElement.appendChild(title)
  recipeElement.appendChild(image)
  recipeElement.appendChild(ingredientsList)
  recipeElement.appendChild(instructions)
    
  recipesDiv.appendChild(recipeElement)
  main.appendChild(recipesDiv)
});
}


//--function -3 diet chart ----------------------------------------------------------

const dietSearchButton = document.getElementById('dietChartButton')
dietSearchButton.addEventListener('click', getDietChart)

async function getMealsForDay(calories, diet) {
  const endpoint = `${BASE_URL}/mealplanner/generate?timeFrame=day&targetCalories=${calories}&diet=${diet}&apiKey=${apikey2}`;
  try {
      const response = await fetch(endpoint);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.meals;
  } catch (error) {
      console.error('Error fetching meals:', error);
      return null;
  }
}
async function getDietChart(){

  const dietspecs = document.querySelector('#dietSpecs').value
  const calories =  document.querySelector('#calories').value
  console.log(dietspecs)
  const meals = await getMealsForDay(calories, dietspecs)
  displayDietplan(meals)

}

async function displayDietplan(meals) {
  const dietPlanDiv = document.getElementById('dietPlan');
  dietPlanDiv.innerHTML = ''; // Clear previous results

  for (const meal of meals) {
      const recipeDetails = await getRecipeDetails(meal.id)
      const mealItem = createMealItem(recipeDetails)
      dietPlanDiv.appendChild(mealItem)
  }
 
}

function createMealItem(recipe) {
  const mealItemDiv = document.createElement('div')
  mealItemDiv.classList.add('meal-item')

  const title = document.createElement('h3')
  title.textContent = recipe.title;

  const image = document.createElement('img')
  image.src = recipe.image
  image.alt = recipe.title

  mealItemDiv.appendChild(title)
  mealItemDiv.appendChild(image)

  return mealItemDiv
}


