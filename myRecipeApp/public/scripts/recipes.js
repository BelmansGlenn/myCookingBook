// FRONT END FILE TO INTERACT WITH THE DOM
// General Const
const input = document.getElementById("input");
const searchBtn = document.getElementById("look");
const recipeContainer = document.getElementById('main');
const myList = document.querySelector('.load');


//AddEventListener

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if(input.value == ""){
        errorFunc();
    }else{
    addRecipe(input.value);
    }
    input.value="";
})

myList.addEventListener('click', (e)=> {
    e.preventDefault();
    loadmyList();
})





//Function
const errorFunc = () =>{
    alert("You have to put something!");
}
const addRecipe = (ingredient) => {

    recipeContainer.innerHTML="";

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    .then(response => response.json())
    .then((data) => {
        console.log(data.meals);
        data.meals.forEach((meal) => {
            let mealCard = `
            <div class="card">
            <img src="${meal.strMealThumb}" alt="" class="img" width="250" height="250">
            <h3 class="titleMeal">${meal.strMeal}</h3>
            <button id="${meal.idMeal}">Add To My List</button>
          </div>`
          recipeContainer.insertAdjacentHTML('beforeend', mealCard);
          const addBtn = document.getElementById(`${meal.idMeal}`);
          addBtn.addEventListener('click', (e) => {
              e.preventDefault();
              addToMyDb(meal);
              
          })
        })
        
    })  
}


const getLoading = (data) => {
    console.log(data);
    recipeContainer.innerHTML="";
    let i =0;
    let j =1000;
    data.data.forEach((id)=> {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id.idmeal}`)
        .then(response => response.json())
        .then((data) => {
            i++;
            j++;
            let mealCard = `
            <div class="cards">
                <div id="content">
                    <div id="face">
                        <i id="${data.meals[0].idMeal}" class="far fa-times-circle fa-2x icon"></i>
                        <img src="${data.meals[0].strMealThumb}" alt="" class="img" width="250" height="330">
                        <h3 class="titleMeal">${data.meals[0].strMeal}</h3>
                        <button class="${data.meals[0].idMeal}">Get The Recipe</button>
                        <button class="top" id="${j}">Done</button
                    </div>
                    <br>
                    <br> 
                    <br>
                    <br>
                    <br>
                    <br>
                    <br>
                    <br>
                    <br>
                    <br>
                    <p id="instr">${data.meals[0].strInstructions}</p>
                    <button class="up" id="${i}">Go Back</button>
                </div>
            </div>`
          recipeContainer.insertAdjacentHTML('beforeend', mealCard);
          const closeCard = document.getElementById(`${data.meals[0].idMeal}`);
          const getRecipe = document.getElementsByClassName(`${data.meals[0].idMeal}`)
          const backToMeal = document.getElementById(`${i}`);
          const donzo = document.getElementById(`${j}`);
          let content = getRecipe[0].parentNode.parentNode;
          closeCard.addEventListener('click', (e)=> {
                e.preventDefault();
                deleteRecipe(data.meals[0]);
                closeCard.parentNode.parentNode.parentNode.remove();
            })
            console.log(getRecipe[0]);
            getRecipe[0].addEventListener('click', (e)=> {
                e.preventDefault();
                console.log(content);
                content.classList.add("click");

            })
            console.log(backToMeal);
            backToMeal.addEventListener('click', (e) => {
                e.preventDefault();
                content.classList.remove('click');
            })

            if(id.isDone == "1"){
                closeCard.parentNode.parentNode.parentNode.classList.add('done');
            }

            donzo.addEventListener('click', (e)=> {
                e.preventDefault();
                if( id.isDone == "0"){
                    closeCard.parentNode.parentNode.parentNode.classList.add('done');
                    id.isDone = "1";
                } else{
                    closeCard.parentNode.parentNode.parentNode.classList.remove('done');
                    id.isDone = "0";
                }
                update({id: data.meals[0], bool:id.isDone});
            })

        })
          
    })
    
}



// DB link


const addToMyDb = (infos) => {
    fetch('api/addmeal', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(infos),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  
}

const loadmyList = () => {
    fetch('api/loadlist', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      getLoading(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    
  }

  const deleteRecipe = (infos)=> {
    fetch('api/remmeal', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(infos),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const update = (su) => {
    fetch('api/update', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(su),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }