import Airtable from 'airtable';
import dotenv from 'dotenv';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

dotenv.config();

export const load: PageServerLoad = async ({ params }) => {
    const id = params.product;
    
    const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.BASE_ID);
    const products = await base(process.env.PRODUCTS_TABLE_ID).select({
        filterByFormula: `{id} = '${id}'`
    }).firstPage();
    
    return {
        product: products.length > 0 ? {
            id: products[0].id,
            fields: products[0].fields,
            createdTime: products[0].createdTime
        } : null,
        productId: id
    };
};

export const actions: Actions = {
  approve: async ({ request }) => {
    const data = await request.formData();
    const productId = data.get('productId') as string;
    const styling = Number(data.get('styling'));
    const functionality = Number(data.get('functionality'));
    const easeOfUse = Number(data.get('easeOfUse'));
    const needeness = Number(data.get('needeness'));
    const bonus = Number(data.get('bonus'));
    const hours = Number(data.get('hours'));
    const hoursJustification = data.get('hoursJustification') as string;

    try {
      const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.BASE_ID);
      
      // First get the product record to retrieve the SlackID
      const productRecord = await base(process.env.PRODUCTS_TABLE_ID).find(productId);
      const submitterSlackID = productRecord.fields.SlackID;
      const tokensFromProduct = (styling + functionality + easeOfUse + needeness + bonus) * hours * 12;

      await base(process.env.PRODUCTS_TABLE_ID).update(productId, {
        "Rating: Styling": styling,
        "Rating: Functionality": functionality,
        "Rating: Ease of Use": easeOfUse,
        "Rating: Needeness": needeness,
        "Rating: Bonus": bonus,
        "Status": "Approved",
        "Hours": hours,
        "Hours Justification": hoursJustification,
        "Payout": tokensFromProduct
      });
      
      // if successfully updated add the tokens to the user
      if (submitterSlackID) {
        const userRecord = await base(process.env.USERS_TABLE_ID).select({
          filterByFormula: `{SlackID} = '${submitterSlackID}'`
        }).firstPage();
        
        if (userRecord.length > 0) {
          const userRecordId = userRecord[0].id;
          const currentTokens = userRecord[0].fields.Tokens || 0;
          const newTokens = currentTokens + tokensFromProduct;
          await base(process.env.USERS_TABLE_ID).update(userRecordId, {
            "Tokens": newTokens
          });
        }
      }
      

      return { success: true };
    } catch (error) {
      console.error('Error approving product:', error);
      return fail(500, { error: 'Failed to approve product' });
    }
  },

  reject: async ({ request }) => {
    const data = await request.formData();
    const productId = data.get('productId') as string;
    const rejectionReason = data.get('rejectionReason') as string;

    try {
      const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.BASE_ID);
      await base(process.env.PRODUCTS_TABLE_ID).update(productId, {
        "Rejection Reason": rejectionReason,
        "Status": "Rejected"
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error rejecting product:', error);
      return fail(500, { error: 'Failed to reject product' });
    }
  }
};