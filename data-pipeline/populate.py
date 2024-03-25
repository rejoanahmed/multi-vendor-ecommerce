import os
import csv
import weaviate
import weaviate.classes as wvc

from dotenv import load_dotenv

load_dotenv()

WEAVIATE_CLUSTER_URL = os.getenv('WEAVIATE_HOST_URL')
WEAVIATE_API_KEY = os.getenv('WEAVIATE_API_KEY')
COHERE_API_KEY = os.getenv('COHERE_EMBED_API_KEY')

client = weaviate.connect_to_wcs(
    cluster_url=WEAVIATE_CLUSTER_URL,
    auth_credentials=weaviate.auth.AuthApiKey(WEAVIATE_API_KEY),
    headers={
        "X-Cohere-Api-Key": COHERE_API_KEY
    }
)
try:
    if client.collections.exists("Product"):
        client.collections.delete("Product")





    questions = client.collections.create(
        name="Product",
        vectorizer_config=wvc.config.Configure.Vectorizer.text2vec_cohere(truncate="RIGHT"),  # If set to "none" you must always provide vectors yourself. Could be any other "text2vec-*" also.
    )

    f = open("./data-pipeline/test-data.csv", "r")
    current_product = None
    try:
        reader = csv.reader(f, delimiter='|')
        products = []
        # Iterate through each row of data
        for product in reader:
            # 0 - productId
            # 1 - name
            # 2 - category
            # 3 - description

            products.append({
                "productId": product[0],
                "name": product[1],
                "category": product[2],
                "description": product[3],
            }
            )
        products_schema = client.collections.get("Product")
        products_schema.data.insert_many(products)
        f.close()

    except Exception as e:
        print(f"something happened {e}. Failure at {current_product}")
        f.close()
finally:
    client.close()