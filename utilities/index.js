const invModel = require("../models/inventory-model");

const Util = {};


Util.getNav = async function() {
    let data = await invModel.getClassifications(); // Ensure function is properly called
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.forEach(row => {
        list += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
    });
    list += "</ul>";
    return list;
};

// Function to build classification grid
Util.buildClassificationGrid = function(data) {
    let grid;
    if (data.length > 0) {
        grid = '<ul id="inv-display">';
        data.forEach(vehicle => {
            grid += `<li>
                        <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                            <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">
                        </a>
                        <div class="namePrice">
                            <hr />
                            <h2>
                                <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                                    ${vehicle.inv_make} ${vehicle.inv_model}
                                </a>
                            </h2>
                            <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
                        </div>
                    </li>`;
        });
        grid += '</ul>';
    } else { 
        grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }
    return grid;
};

module.exports = Util;


// Function to wrap vehicle HTML details
Util.wrapVehicleHTML = function(vehicle) {
    return `
    <div class="vehicle-detail">
        <h1>${vehicle.make} ${vehicle.model} (${vehicle.year})</h1>
        <img src="${vehicle.image_url}" alt="${vehicle.make} ${vehicle.model}">
        <p><strong>Price:</strong> $${vehicle.price.toLocaleString()}</p>
        <p><strong>Mileage:</strong> ${vehicle.mileage.toLocaleString()} miles</p>
        <p>${vehicle.description}</p>
    </div>
    `;
};

// Correctly exporting all functions together
module.exports = Util;
