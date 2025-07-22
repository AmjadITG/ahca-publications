// // app/routes/api.update_metafield.jsx
// import { json } from '@remix-run/node';
// import { authenticate } from '../shopify.server'; // ✅ Update this path if needed

// export const action = async ({ request }) => {
//   const { admin } = await authenticate.admin(request);
//   const body = await request.json();

//   const { productId, fileUrl } = body;

//   const mutation = `
//     mutation productUpdateMetafield($input: MetafieldsSetInput!) {
//       metafieldsSet(metafields: [$input]) {
//         metafields {
//           id
//           key
//           namespace
//           value
//         }
//         userErrors {
//           field
//           message
//         }
//       }
//     }
//   `;

//   const variables = {
//     input: {
//       ownerId: productId,
//       namespace: "custom",
//       key: "book_url",
//       type: "single_line_text_field",
//       value: fileUrl,
//     },
//   };

//   const response = await admin.graphql(mutation, { variables });
//   const result = await response.json();

//   if (result?.data?.metafieldsSet?.userErrors?.length > 0) {
//     return json({ success: false, errors: result.data.metafieldsSet.userErrors }, { status: 400 });
//   }

//   return json({ success: true });
// };
