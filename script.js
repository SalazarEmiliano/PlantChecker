const plantIdApiKey = 'NlhJDleLT2yZB0KF80Z5AgnwqlC5eSWOGyhqAGTn0DkeGHimHy';
const trefleToken = '2UQXif_l_DRFs5YJw51OdSUGki1t_NBrvUGkSWyp1hY';
const searchInput = document.querySelector('#plant-name');

const searchBtn = document.querySelector('#search-btn');
const searchResults = document.querySelector('#search-results');
const plantResults = document.querySelector('#plant-results');

const identifyButton = document.querySelector("#identify-button");
const resultsDiv = document.querySelector("#results");

const plantImageInput = document.querySelector('#plant-image');

identifyButton.addEventListener("click", async () => {
 const file = plantImageInput.files[0];
 if (!file) {
 alert("Please select an image of a plant.");
 return;
 }
 const reader = new FileReader();
 reader.onload = async (event) => {
 const imageData = event.target.result;
 const data = await identifyPlant(imageData);
 // Display the results
 displayResults(data);
 };
 reader.readAsDataURL(file);
});

const apiKey = "NlhJDleLT2yZB0KF80Z5AgnwqlC5eSWOGyhqAGTn0DkeGHimHy";
const plantIdUrl = "https://api.plant.id/v2/identify";

async function identifyPlant(imageData) {
 const response = await fetch(plantIdUrl, {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 "Api-Key": plantIdApiKey,
 },
 body: JSON.stringify({
 images: [imageData],
 organs: ["leaf", "flower", "fruit", "bark", "habit", "other"],
 }),
 });
 const data = await response.json(); 
 return data;
}

function displayResults(data) {
    if(data.is_plant == true) {

    
 // Clear the results div
 resultsDiv.innerHTML = '';

 // Create a heading for the identification result
 const resultHeading = document.createElement('h2');
 resultHeading.textContent = 'Identification Result';
 resultsDiv.appendChild(resultHeading);

 // Create a list for the identification result details
 const resultList = document.createElement('ul');
 resultsDiv.appendChild(resultList);

 // Add the ID to the result list
 const idItem = document.createElement('li');
 idItem.textContent = `ID: ${data.id}`;
 resultList.appendChild(idItem);

 // Add the custom ID to the result list
 const customIdItem = document.createElement('li');
 customIdItem.textContent = `Custom ID: ${data.custom_id}`;
 resultList.appendChild(customIdItem);

 // Add the metadata to the result list
 const metaDataItem = document.createElement('li');
 metaDataItem.textContent = `Metadata: ${JSON.stringify(data.meta_data)}`;
 resultList.appendChild(metaDataItem);

 // Add the uploaded datetime to the result list
 const uploadedDatetimeItem = document.createElement('li');
 const uploadedDatetime = new Date(data.uploaded_datetime * 1000);
 uploadedDatetimeItem.textContent =
 `Uploaded: ${uploadedDatetime.toLocaleString()}`;
 resultList.appendChild(uploadedDatetimeItem);

 // Add the finished datetime to the result list
 const finishedDatetimeItem =
 document.createElement('li');
 const finishedDatetime =
 new Date(data.finished_datetime * 1000);
 finishedDatetimeItem.textContent =
 `Finished: ${finishedDatetime.toLocaleString()}`;
 resultList.appendChild(finishedDatetimeItem);

 // Add other properties to the result list
 for (const [key, value] of Object.entries(data)) {
 if (
 key !== 'id' &&
 key !== 'custom_id' &&
 key !== 'meta_data' &&
 key !== 'suggestions' &&
 key !== 'uploaded_datetime' &&
 key !== 'finished_datetime'
 ) {
 const propertyItem =
 document.createElement('li');
 propertyItem.textContent =
 `${key}: ${JSON.stringify(value)}`;
 resultList.appendChild(propertyItem);
 }
 }

 // Create a heading for the plant name
 const plantNameHeading =
 document.createElement('h2');
 plantNameHeading.textContent =
 'Plant Name';
 resultsDiv.appendChild(plantNameHeading);

 // Create a list for the plant suggestions
 const suggestionsList =
 document.createElement('ul');
 resultsDiv.appendChild(suggestionsList);


 suggestionDisplay(data.suggestions[0].plant_name);
 // Add each suggestion to the list
 data.suggestions.forEach(suggestion => {
 const suggestionItem =
 document.createElement('li');
 suggestionItem.textContent =
 `${suggestion.plant_name} (${suggestion.probability.toFixed(2)})`;
 suggestionsList.appendChild(suggestionItem);

 //Test 
 //suggestionDisplay(suggestion.plant_name);
 //
 // Create a sublist for the plant details
 const detailsList =
 document.createElement('ul');
 suggestionItem.appendChild(detailsList);

 // Add the scientific name to the details list
 const scientificNameItem =
 document.createElement('li');
 scientificNameItem.textContent =
 `Scientific Name: ${suggestion.plant_details.scientific_name}`;
 detailsList.appendChild(scientificNameItem);

 // Add the structured name to the details list
 const structuredNameItem =
 document.createElement('li');
 structuredNameItem.textContent =
 `Structured Name: ${JSON.stringify(suggestion.plant_details.structured_name)}`;
 detailsList.appendChild(structuredNameItem);

 // Add other properties to the details list
 for (const [key, value] of Object.entries(suggestion)) {
 if (
 key !== 'plant_name' &&
 key !== 'plant_details' &&
 key !== 'probability'
 ) {
 const propertyItem =
 document.createElement('li');
 propertyItem.textContent =
 `${key}: ${JSON.stringify(value)}`;
 detailsList.appendChild(propertyItem);
 }
 }
 });

}
else {
    alert("The image does not contain a plant");
}
}

searchInput.addEventListener('input', () => {
 const plantName = searchInput.value;
 fetch(`https://trefle.io/api/v1/plants/search?token=${trefleToken}&q=${plantName}&complete_data=true`)
 .then((response) => response.json())
 .then((data) => {
 if (data.data) {
 plantResults.innerHTML = '';
 data.data.forEach((plant) => {
 const option =
 document.createElement('option');
 option.value =
 plant.common_name;
 plantResults.appendChild(option);
 });
 }
 })
 .catch((error) => console.log(error));
});

searchBtn.addEventListener('click', () => {
 const plantName = searchInput.value;
 fetch(`https://trefle.io/api/v1/plants/search?token=${trefleToken}&q=${plantName}&complete_data=true`)
 .then((response) => response.json())
 .then((data) => {
 searchResults.innerHTML = ''; 
 data.data.forEach((plant) => {
 if (plant.common_name === plantName) {
 fetch(`https://trefle.io/api/v1/plants/${plant.id}?token=${trefleToken}`)
 .then((response) =>
 response.json()
 )
 .then((data) => {
 const div =
 document.createElement(
 'div'
 );
 div.innerHTML =
 `<h2>${data.data.common_name || ''}</h2>
 <h3>General Information</h3>
 <ul>
 <li>Scientific Name: ${
 data.data.scientific_name || ''
 }</li>
 <li>Genus: ${
 data.data.genus.name || ''
 }</li>
 <li>Family: ${
 data.data.family.name || ''
 }</li>
 <li>Year: ${
 data.data.year || ''
 }</li>
 <li>Bibliography: ${
 data.data.bibliography || ''
 }</li>
 </ul>`;
 if (
 data.data.family_common_name !== null
 ) {
 div.innerHTML += `<p>Family Common Name: ${
 data.data.family_common_name
 }</p>`;
 }
 if (data.data.observations) {
 div.innerHTML += `<p>Observations: ${
 data.data.observations
 }</p>`;
 }
 if (
 data.data.main_species &&
 data.data.main_species.vegetable !== null
 ) {
 div.innerHTML += `<p>Vegetable: ${
 data.data.main_species.vegetable ? 'Yes' : 'No'
 }</p>`;
 }
 if (data.data.edible_part) {
 div.innerHTML += `<p>Edible Part(s): ${
 data.data.edible_part
 }</p>`;
 }
 if (
 data.data.main_species &&
 data.data.main_species.edible !== null
 ) {
 div.innerHTML += `<p>Edible: ${
 data.data.main_species.edible ? 'Yes' : 'No'
 }</p>`;
 }
 if (data.data.medicinal) {
 div.innerHTML += `<p>Medicinal Properties: ${
 data.data.medicinal
 }</p>`;
 }
 if (data.data.duration) {
 div.innerHTML += `<p>Duration: ${
 data.data.duration
 }</p>`;
 }
 if (data.data.growth_habit) {
 div.innerHTML += `<p>Growth Habit: ${
 data.data.growth_habit
 }</p>`;
 }
 if (data.data.growth_rate) {
 div.innerHTML += `<p>Growth Rate: ${
 data.data.growth_rate
 }</p>`;
 }
 if (data.data.toxicity) {
 div.innerHTML += `<p>Toxicity: ${
 data.data.toxicity
 }</p>`;
 }

 // Images
 const images =
 data.data.main_species.images;
 if (images) {
 let imagesHTML =
 '<h3>Images</h3>';
 let hasImages =
 false;
 if (
 images.flower &&
 images.flower.length > 0
 ) {
 hasImages =
 true;
 imagesHTML +=
 '<h4>Flower</h4>';
 images.flower.forEach(
 (image) => {
 imagesHTML +=
 `<img src="${image.image_url}" alt="Flower" />`;
 }
 );
 }
 if (
 images.fruit &&
 images.fruit.length > 0
 ) {
 hasImages =
 true;
 imagesHTML +=
 '<h4>Fruit</h4>';
 images.fruit.forEach(
 (image) => {
 imagesHTML +=
 `<img src="${image.image_url}" alt="Fruit" />`;
 }
 );
 }
 if (images.bark && images.bark.length > 0) {
    hasImages = true;
    imagesHTML += '<h4>Bark</h4>';
    images.bark.forEach((image) => {
    imagesHTML += `<img src="${image.image_url}" alt="Bark" />`;
    });
    }
    if (images.leaf && images.leaf.length > 0) {
    hasImages = true;
    imagesHTML += '<h4>Leaf</h4>';
    images.leaf.forEach((image) => {
    imagesHTML += `<img src="${image.image_url}" alt="Leaf" />`;
    });
    }
    if (images.habit && images.habit.length > 0) {
    hasImages = true;
    imagesHTML += '<h4>Habit</h4>';
    images.habit.forEach((image) => {
    imagesHTML += `<img src="${image.image_url}" alt="Habit" />`;
    });
    }
    if (images.other && images.other.length > 0) {
    hasImages = true;
    imagesHTML += '<h4>Other</h4>';
    images.other.forEach((image) => {
    imagesHTML += `<img src="${image.image_url}" alt="Other" />`;
    });
    }
   
    if (hasImages) {
    div.innerHTML += imagesHTML;
    }
    }
   
    // Distribution
    const distribution = data.data.main_species.distribution;
    if (distribution && distribution.native && distribution.native.length > 0) {
    let nativeStr = '';
    distribution.native.forEach((nativeCountry, index) => {
    nativeStr +=
    index === distribution.native.length - 1
    ? `${nativeCountry}`
    : `${nativeCountry}, `;
    });
    div.innerHTML += `<h3>Distribution:</h3><ul><li><strong>Native:</strong>${nativeStr}</li></ul>`;
    }
   
    // Flower
    const flower = data.data.main_species.flower;
    if (flower && flower.color && flower.conspicuous !== null) {
    let colorStr = '';
    flower.color.forEach((color, index) => {
    colorStr +=
    index === flower.color.length - 1 ? `${color}` : `${color}, `;
    });
    let conspicuousStr = flower.conspicuous ? 'Yes' : 'No';
    div.innerHTML += `<h3>Flower:</h3><ul><li><strong>Color:</strong>${colorStr}</li><li><strong>Conspicuous:</strong>${conspicuousStr}</li></ul>`;
    }
   
    // Growth
    const growth = data.data.main_species.growth;
    let growthHtml = '<h3>Growth:</h3><ul>';
    let hasGrowthInfo = false;
    if (growth) {
    if (growth.ph_minimum && growth.ph_maximum) {
    hasGrowthInfo = true;
    growthHtml += `<li><strong>pH:</strong>${growth.ph_minimum} - ${growth.ph_maximum}</li>`;
    }
    if (growth.light) {
    hasGrowthInfo = true;
    growthHtml += `<li><strong>Light:</strong>${growth.light}</li>`;
    }
    if (growth.atmospheric_humidity) {
    hasGrowthInfo = true;
    growthHtml += `<li><strong>Atmospheric Humidity:</strong>${growth.atmospheric_humidity}</li>`;
    }
    if (
    growth.minimum_temperature &&
    growth.minimum_temperature.deg_c &&
    growth.minimum_temperature.deg_f
    ) {
    hasGrowthInfo = true;
    growthHtml += `<li><strong>Minimum Temperature:</strong>${growth.minimum_temperature.deg_c}°C (${growth.minimum_temperature.deg_f}°F)</li>`;
    }
    if (
    growth.maximum_temperature &&
    growth.maximum_temperature.deg_c &&
    growth.maximum_temperature.deg_f
    ) {
    hasGrowthInfo = true;
    growthHtml += `<li><strong>Maximum Temperature:</strong>${growth.maximum_temperature.deg_c}°C (${growth.maximum_temperature.deg_f}°F)</li>`;
    }
    if (growth.soil_nutriments) {
    hasGrowthInfo = true;
    growthHtml += `<li><strong>Soil Nutriments:</strong>${growth.soil_nutriments}</li>`;
    }
    if (growth.soil_salinity !== null) {
    hasGrowthInfo = true;
    growthHtml += `<li><strong>Soil Salinity:</strong>${growth.soil_salinity}</li>`;
    }
    }
    if (hasGrowthInfo) {
    growthHtml += '</ul>';
    div.innerHTML += growthHtml;
    }
   
    // Plant Image
    if (data.data.image_url) {
    div.innerHTML += `<img src="${data.data.image_url}" alt="${plant.common_name}"/>`;
    }
   
    searchResults.appendChild(div);

})
.catch((error) => console.log(error));
}
});
})
.catch((error) => console.log(error));
});

//

function suggestionDisplay(suggestion) {
    const plantName = suggestion;
    fetch(`https://trefle.io/api/v1/plants/search?token=${trefleToken}&q=${plantName}&complete_data=true`)
    .then((response) => response.json())
    .then((data) => {
    searchResults.innerHTML = '';
    data.data.forEach((plant) => {
        
    if (plant.scientific_name === plantName) {
    fetch(`https://trefle.io/api/v1/plants/${plant.id}?token=${trefleToken}`)
    .then((response) =>
    response.json()
    )
    .then((data) => {
    const div =
    document.createElement(
    'div'
    );
    div.innerHTML =
    `<h2>${data.data.common_name || ''}</h2>
    <h3>General Information</h3>
    <ul>
    <li>Scientific Name: ${
    data.data.scientific_name || ''
    }</li>
    <li>Genus: ${
    data.data.genus.name || ''
    }</li>
    <li>Family: ${
    data.data.family.name || ''
    }</li>
    <li>Year: ${
    data.data.year || ''
    }</li>
    <li>Bibliography: ${
    data.data.bibliography || ''
    }</li>
    </ul>`;
    if (
    data.data.family_common_name !== null
    ) {
    div.innerHTML += `<p>Family Common Name: ${
    data.data.family_common_name
    }</p>`;
    }
    if (data.data.observations) {
    div.innerHTML += `<p>Observations: ${
    data.data.observations
    }</p>`;
    }
    if (
    data.data.main_species &&
    data.data.main_species.vegetable !== null
    ) {
    div.innerHTML += `<p>Vegetable: ${
    data.data.main_species.vegetable ? 'Yes' : 'No'
    }</p>`;
    }
    if (data.data.edible_part) {
    div.innerHTML += `<p>Edible Part(s): ${
    data.data.edible_part
    }</p>`;
    }
    if (
    data.data.main_species &&
    data.data.main_species.edible !== null
    ) {
    div.innerHTML += `<p>Edible: ${
    data.data.main_species.edible ? 'Yes' : 'No'
    }</p>`;
    }
    if (data.data.medicinal) {
    div.innerHTML += `<p>Medicinal Properties: ${
    data.data.medicinal
    }</p>`;
    }
    if (data.data.duration) {
    div.innerHTML += `<p>Duration: ${
    data.data.duration
    }</p>`;
    }
    if (data.data.growth_habit) {
    div.innerHTML += `<p>Growth Habit: ${
    data.data.growth_habit
    }</p>`;
    }
    if (data.data.growth_rate) {
    div.innerHTML += `<p>Growth Rate: ${
    data.data.growth_rate
    }</p>`;
    }
    if (data.data.toxicity) {
    div.innerHTML += `<p>Toxicity: ${
    data.data.toxicity
    }</p>`;
    }
   
    // Images
    const images =
    data.data.main_species.images;
    if (images) {
    let imagesHTML =
    '<h3>Images</h3>';
    let hasImages =
    false;
    if (
    images.flower &&
    images.flower.length > 0
    ) {
    hasImages =
    true;
    imagesHTML +=
    '<h4>Flower</h4>';
    images.flower.forEach(
    (image) => {
    imagesHTML +=
    `<img src="${image.image_url}" alt="Flower" />`;
    }
    );
    }
    if (
    images.fruit &&
    images.fruit.length > 0
    ) {
    hasImages =
    true;
    imagesHTML +=
    '<h4>Fruit</h4>';
    images.fruit.forEach(
    (image) => {
    imagesHTML +=
    `<img src="${image.image_url}" alt="Fruit" />`;
    }
    );
    }
    if (images.bark && images.bark.length > 0) {
       hasImages = true;
       imagesHTML += '<h4>Bark</h4>';
       images.bark.forEach((image) => {
       imagesHTML += `<img src="${image.image_url}" alt="Bark" />`;
       });
       }
       if (images.leaf && images.leaf.length > 0) {
       hasImages = true;
       imagesHTML += '<h4>Leaf</h4>';
       images.leaf.forEach((image) => {
       imagesHTML += `<img src="${image.image_url}" alt="Leaf" />`;
       });
       }
       if (images.habit && images.habit.length > 0) {
       hasImages = true;
       imagesHTML += '<h4>Habit</h4>';
       images.habit.forEach((image) => {
       imagesHTML += `<img src="${image.image_url}" alt="Habit" />`;
       });
       }
       if (images.other && images.other.length > 0) {
       hasImages = true;
       imagesHTML += '<h4>Other</h4>';
       images.other.forEach((image) => {
       imagesHTML += `<img src="${image.image_url}" alt="Other" />`;
       });
       }
      
       if (hasImages) {
       div.innerHTML += imagesHTML;
       }
       }
      
       // Distribution
       const distribution = data.data.main_species.distribution;
       if (distribution && distribution.native && distribution.native.length > 0) {
       let nativeStr = '';
       distribution.native.forEach((nativeCountry, index) => {
       nativeStr +=
       index === distribution.native.length - 1
       ? `${nativeCountry}`
       : `${nativeCountry}, `;
       });
       div.innerHTML += `<h3>Distribution:</h3><ul><li><strong>Native:</strong>${nativeStr}</li></ul>`;
       }
      
       // Flower
       const flower = data.data.main_species.flower;
       if (flower && flower.color && flower.conspicuous !== null) {
       let colorStr = '';
       flower.color.forEach((color, index) => {
       colorStr +=
       index === flower.color.length - 1 ? `${color}` : `${color}, `;
       });
       let conspicuousStr = flower.conspicuous ? 'Yes' : 'No';
       div.innerHTML += `<h3>Flower:</h3><ul><li><strong>Color:</strong>${colorStr}</li><li><strong>Conspicuous:</strong>${conspicuousStr}</li></ul>`;
       }
      
       // Growth
       const growth = data.data.main_species.growth;
       let growthHtml = '<h3>Growth:</h3><ul>';
       let hasGrowthInfo = false;
       if (growth) {
       if (growth.ph_minimum && growth.ph_maximum) {
       hasGrowthInfo = true;
       growthHtml += `<li><strong>pH:</strong>${growth.ph_minimum} - ${growth.ph_maximum}</li>`;
       }
       if (growth.light) {
       hasGrowthInfo = true;
       growthHtml += `<li><strong>Light:</strong>${growth.light}</li>`;
       }
       if (growth.atmospheric_humidity) {
       hasGrowthInfo = true;
       growthHtml += `<li><strong>Atmospheric Humidity:</strong>${growth.atmospheric_humidity}</li>`;
       }
       if (
       growth.minimum_temperature &&
       growth.minimum_temperature.deg_c &&
       growth.minimum_temperature.deg_f
       ) {
       hasGrowthInfo = true;
       growthHtml += `<li><strong>Minimum Temperature:</strong>${growth.minimum_temperature.deg_c}°C (${growth.minimum_temperature.deg_f}°F)</li>`;
       }
       if (
       growth.maximum_temperature &&
       growth.maximum_temperature.deg_c &&
       growth.maximum_temperature.deg_f
       ) {
       hasGrowthInfo = true;
       growthHtml += `<li><strong>Maximum Temperature:</strong>${growth.maximum_temperature.deg_c}°C (${growth.maximum_temperature.deg_f}°F)</li>`;
       }
       if (growth.soil_nutriments) {
       hasGrowthInfo = true;
       growthHtml += `<li><strong>Soil Nutriments:</strong>${growth.soil_nutriments}</li>`;
       }
       if (growth.soil_salinity !== null) {
       hasGrowthInfo = true;
       growthHtml += `<li><strong>Soil Salinity:</strong>${growth.soil_salinity}</li>`;
       }
       }
       if (hasGrowthInfo) {
       growthHtml += '</ul>';
       div.innerHTML += growthHtml;
       }
      
       // Plant Image
       if (data.data.image_url) {
       div.innerHTML += `<img src="${data.data.image_url}" alt="${plant.common_name}"/>`;
       }
      
       searchResults.appendChild(div);
   })
   .catch((error) => console.log(error));
   }
   });
   })
   .catch((error) => console.log(error));
   }