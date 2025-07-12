# Plant Information Setup Guide

## 1. Create Appwrite Collection

### Collection Details:
- **Collection Name**: `plant_info`
- **Collection ID**: (will be generated)

### Attributes to Create:
1. **class_name** (string, required) - The CLASS_NAME from CSV
2. **common_name** (string, required) - Common name of the plant
3. **scientific_name** (string, required) - Scientific name
4. **luhya_name** (string, optional) - Local Luhya name
5. **ailment_treated** (string, required) - What ailments it treats
6. **preparation_method** (string, required) - How to prepare
7. **dosage** (string, required) - Dosage instructions
8. **created_at** (string, required) - Timestamp
9. **updated_at** (string, required) - Timestamp

### Permissions:
- **Read**: Any (users can read plant info)
- **Create**: Users (for admin to add data)
- **Update**: Users (for admin to update data)
- **Delete**: Users (for admin to delete data)
- **Document Security**: Enabled

## 2. Sample Data to Add:

```json
[
  {
    "class_name": "Aloe vera",
    "common_name": "Aloe vera",
    "scientific_name": "Aloe barbadensis",
    "luhya_name": "Rikaha",
    "ailment_treated": "Burns, wounds, constipation, diabetes, ulcers",
    "preparation_method": "Fresh gel applied or juice extracted",
    "dosage": "1-2 tbsp gel/juice, 2-3 times daily",
    "created_at": "2025-01-12T00:00:00.000Z",
    "updated_at": "2025-01-12T00:00:00.000Z"
  },
  {
    "class_name": "Amaranthus-Viridis",
    "common_name": "Pig Weed",
    "scientific_name": "Amaranthus viridis",
    "luhya_name": "Tsimboka",
    "ailment_treated": "Anemia, digestive issues, fever",
    "preparation_method": "Boiled leaves as tea or cooked as vegetable",
    "dosage": "1 cup tea, 2-3 times daily",
    "created_at": "2025-01-12T00:00:00.000Z",
    "updated_at": "2025-01-12T00:00:00.000Z"
  },
  {
    "class_name": "Basale",
    "common_name": "Malabar Spinach",
    "scientific_name": "Basella alba",
    "luhya_name": "Enderema",
    "ailment_treated": "Ulcers, skin conditions, anemia",
    "preparation_method": "Leaves boiled or eaten fresh",
    "dosage": "1 cup decoction, twice daily",
    "created_at": "2025-01-12T00:00:00.000Z",
    "updated_at": "2025-01-12T00:00:00.000Z"
  }
]
```

## 3. Next Steps:
1. Create the collection in Appwrite Console
2. Add the plant info service to your app
3. Create the plant detail screen
4. Add "Learn More" button to prediction results
5. Import your CSV data

## 4. Import Process:
You can either:
- Manually add each plant through Appwrite Console
- Use the Appwrite API to bulk import from your CSV
- Create an admin screen in your app to import data
