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
Util.buildVehicleHTML = function(vehicle) {
    return `
        <div class="vehicle-detail">
            <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
            <div class="vehicle-info">
                <h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>
                <p><strong>Year:</strong> ${vehicle.inv_year}</p>
                <p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>
                <p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>
                <p>${vehicle.inv_description}</p>
            </div>
        </div>`;
};

// Function to handle async errors in route controllers
Util.handleErrors = function (fn) {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};


// Correctly exporting all functions together
module.exports = Util;
