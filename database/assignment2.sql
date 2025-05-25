-- Insert a new account (Tony Stark)
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Update Tony Stark’s account type to "Admin"
UPDATE public.account 
SET account_type = 'Admin' 
WHERE account_email = 'tony@starkent.com';


--Delete Tony Stark’s record
DELETE FROM public.account 
WHERE account_email = 'tony@starkent.com';

-- Modify GM Hummer's description using REPLACE()
UPDATE inventory 
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior') 
WHERE inv_model = 'Hummer';


-- Inner Join to Select Sport Category Vehicles
SELECT inventory.inv_make, inventory.inv_model, classification.classification_name 
FROM inventory 
INNER JOIN classification ON inventory.classification_id = classification.classification_id 
WHERE classification.classification_name = 'Sport';


--Update Image Paths to Include /vehicles
UPDATE inventory 
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
