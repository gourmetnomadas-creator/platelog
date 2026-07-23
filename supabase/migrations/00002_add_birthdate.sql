-- Store birthdate so age is always derived exactly, instead of a static number
ALTER TABLE profiles ADD COLUMN birthdate date;
