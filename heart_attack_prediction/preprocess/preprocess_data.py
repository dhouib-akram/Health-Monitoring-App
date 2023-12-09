import pandas as pd
from sklearn.preprocessing import LabelEncoder
import joblib
from sklearn import preprocessing
def transform_user_data(user_df):
    user_df = user_df.copy()
        # Create age_bin and BMI_Class
        
    user_df['age_bin'] = pd.cut(user_df['age'], [0, 20, 30, 35, 40, 45, 50, 55, 60, 150], 
                                labels=['0-20', '20-30', '30-35', '35-40','40-45','45-50','50-55','55-60','60-65'])

    user_df['bmi'] = user_df['weight'] / ((user_df['height'] / 100) ** 2)

    rating = []
    for row in user_df['bmi']:
        if row < 18.5:
            rating.append(1)  # UnderWeight
        elif 18.5 <= row <= 24.9:
            rating.append(2)  # NormalWeight
        elif 25 <= row <= 29.9:
            rating.append(3)  # OverWeight
        elif 30 <= row <= 34.9:
            rating.append(4)  # ClassObesity_1
        elif 35 <= row <= 39.9:
            rating.append(5)  # ClassObesity_2
        elif 40 <= row <= 49.9:
            rating.append(6)  # ClassObesity_3
        elif row >= 50:
            rating.append('Error')
        else:
            rating.append('Not_Rated')

    user_df['BMI_Class'] = rating

    # Calculate MAP and its corresponding class
    user_df['MAP'] = ((2 * user_df['ap_lo']) + user_df['ap_hi']) / 3

    map_values = []
    for row in user_df['MAP']:
        if row <79.9:
            map_values.append(2)  # Normal
        elif 80 <= row <= 89.9:
            map_values.append(3)  # Normal
        elif 90 <= row <= 99.9:
            map_values.append(4)  # Normal
        elif 100 <= row <= 109.9:
            map_values.append(5)  # High
        elif 110 <= row <= 119.9:
            map_values.append(6)  # Normal
        elif row >= 120:
            map_values.append(7)
        else:
            map_values.append('Not_Rated')

    user_df['MAP_Class'] = map_values

    # Drop unnecessary columns
    user_df=user_df[["gender","height","weight","bmi","ap_hi","ap_lo","MAP","age","age_bin","BMI_Class","MAP_Class","cholesterol","gluc","smoke","active"]]
    return user_df




def transform_cat(user_df):
    user_df = user_df.copy()
    user_cat = user_df[["gender","age_bin","BMI_Class","MAP_Class","cholesterol","gluc","smoke","active"]].copy()

    # Mapping dictionaries for each feature
    gender_mapping = {1: 0, 2: 1}
    age_bin_mapping = {'20-30': 0, '35-40': 1, '40-45': 2, '45-50': 3, '50-55': 4, '55-60': 5, '60-65': 6}
    BMI_Class_mapping = {1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5}
    MAP_Class_mapping = {2: 0, 3: 1, 4: 2, 5: 3, 6: 4, 7: 5}
    cholesterol_mapping = {1: 0, 2: 1, 3: 2}
    gluc_mapping = {1: 0, 2: 1, 3: 2}
  # Apply the mapping to user_data
    user_cat['gender'] = user_cat['gender'].map(gender_mapping)
    user_cat['age_bin'] = user_cat['age_bin'].map(age_bin_mapping).astype(int)
    user_cat['BMI_Class'] = user_cat['BMI_Class'].map(BMI_Class_mapping)
    user_cat['MAP_Class'] = user_cat['MAP_Class'].map(MAP_Class_mapping)
    user_cat['cholesterol'] = user_cat['cholesterol'].map(cholesterol_mapping)
    user_cat['gluc'] = user_cat['gluc'].map(gluc_mapping)

    return user_cat
def apply_kmodes(user_cat):
    if user_cat.iloc[0]['gender'] == 0:  # Male
        kmodes_model_male = joblib.load('../heart_attack_prediction/preprocess/kmodes_model_male.joblib')
        clusters_male = kmodes_model_male.predict(user_cat)
        user_cat.insert(0, "Cluster", clusters_male, True)
        user_cat["Cluster"].replace({0: 2, 1: 3}, inplace=True)
        print(user_cat.Cluster)
        return user_cat
    else:  # Female
        kmodes_model_female = joblib.load('../heart_attack_prediction/preprocess/kmodes_model_female.joblib')
        clusters_female = kmodes_model_female.predict(user_cat)
        user_cat.insert(0, "Cluster", clusters_female, True)
        return user_cat
def preprocess(data):
    df = pd.DataFrame([data])
    df = transform_user_data(df)
    df_cat = transform_cat(df)
    df_cat = apply_kmodes(df_cat)
    return df_cat