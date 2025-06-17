--1st SQL statement (code works)
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--2nd SQL statement Account type UPDATE

--(code is not working- i keep receiving an error message and yet Admin is a valid account type)
--ERROR:  invalid input value for enum account_type: "Admin"
--LINE 2: SET account_type = 'Admin'
--                      ^ 
--SQL state: 22P02
--Character: 42

UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';


--3rd SQL statement (code works)
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

--4th SQL statement (code works)
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

--5th SQL statement
SELECT 
    inv_make,
    inv_model,
    classification.classification_name
FROM 
    public.inventory
INNER JOIN 
    public.classification
ON 
    inventory.classification_id = classification.classification_id
WHERE 
    classification.classification_name = 'Sport';


--6th SQL statement
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    review_id SERIAL PRIMARY KEY,
    inv_id INTEGER NOT NULL REFERENCES public.inventory(inv_id),
    account_id INTEGER NOT NULL REFERENCES public.account(account_id),
    review_text TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(inv_id, account_id)
);


