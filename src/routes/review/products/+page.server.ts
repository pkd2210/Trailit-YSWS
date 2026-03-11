import Airtable from "airtable";
import dotenv from "dotenv";

dotenv.config();

export async function load() {
	const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.BASE_ID!);

	const products = await base(process.env.PRODUCTS_TABLE_ID!).select().all();

	return {
		products: products.map(record => ({
			...record.fields
		}))
	};
}