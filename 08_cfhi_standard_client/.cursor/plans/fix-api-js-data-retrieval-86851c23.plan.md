<!-- 86851c23-953c-48d4-98ce-34d54a96f2b3 c729fbe2-f96a-4d34-acc2-f7c93f620ded -->
# Fix Api.js Data Retrieval for Standard Project

## Problem Summary

`Api.js` has placeholder API methods that throw errors instead of making actual Quickbase API calls. It needs to be restructured to match `compApi.js` architecture while using Standard-specific queries and field lists.

## Key Changes Required

### 1. Update ApiService Class Structure (lines 1106-1278)

**Add Missing Properties to Constructor:**

- Add `baseUrl`, `userToken`, `appId` (matching compApi.js lines 3679-3681)
- Add `recordClientHTMLArray` and `recordPeerHTMLArray` arrays
- Remove placeholder properties

**Replace makeQuickbaseApiCall Method:**

- Remove the placeholder that throws an error (lines 1229-1237)
- API calls will use jQuery's `$.get()` with global `peerData` and `clientData` table IDs from Index.html

### 2. Rewrite getRecordsForPeer Method (lines 1120-1151)

**Current Issues:**

- Wrong parameters: `(years, regions, sliderValue, sliderValue2)`
- Tries to call non-existent `makeQuickbaseApiCall()`

**New Implementation (based on compApi.js lines 3687-3838):**

- Use recursive pattern: `async getRecordsForPeer(years, dataStr = "<qdbapi>")`
- Build XML string accumulating records across all years
- Use `$.get(peerData, apiCallPeerData)` for actual API calls
- Build query with Standard-specific field IDs and filters

**Standard Query Structure:**

```javascript
query: `{195.EX.${currentYear}} AND {193.EX.'Standard'} AND ${clientQuery}`
// Add filters for regions (267), sites (268), giving units (123)
```

**Standard clist (from analyzing Api.js data processing):**

- Field 195: s52 Formatted Year
- Field 123: s02 - Giving Units  
- Field 193: MAIN SurveyType
- Field 267: MAIN QueryRegions
- Field 268: MAIN QueryMultisite
- Field 186: Related Client
- Fields for data processing: 160, 161, 143, 145, 164, 165, 149, 154, 184, etc.

### 3. Rewrite getRecordsForClient Method (lines 1158-1185)

**Current Issues:**

- Wrong parameters: `(clientRid, years)`
- Calls non-existent `makeQuickbaseApiCall()`

**New Implementation (based on compApi.js lines 3842-3915):**

- Use recursive pattern: `async getRecordsForClient(years, dataStr = "<qdbapi>")`
- Accumulate XML records across years
- Use `$.get(clientData, apiCallClientData)` 

**Standard Query Structure:**

```javascript
query: `{98.EX.${ClientRid}} AND {105.EX.'Standard'} AND {474.EX.${currentYear}}`
```

**Standard clist (from clientFieldIds.md for Standard ratios):**

- Field 474: s52 Formatted Year
- Field 98: Related Client
- Field 105: Main_SurveyType
- Field 211-233: CFHI STAND ratios (01-08)
- Fields 22, 59, 60: demographic data
- Additional Standard-specific fields

### 4. Rewrite getRecordsForUniqueClientPeerNames Method (lines 1190-1223)

**New Implementation (based on compApi.js lines 3918-4027):**

- Use `$.get(peerData, apiCallPeerData)` instead of placeholder
- Query: `{195.XEX.''} AND {193.EX.'Standard'}`
- Extract unique client names from field 186 (Related Client) or 301 (Client - Merged Client Name)
- Populate global `window.clientDataStore` with client metadata
- Initialize filter handlers after loading

### 5. Add Missing Helper Methods

**From compApi.js that Api.js needs:**

- `getClientQuery(selectedClientsSet)` - builds dynamic client filter query (lines 4123-4135)
- `_initializeFilterHandlers()` - sets up UI event listeners (lines 4030-4058)
- `_handleFiltersChanged()` - updates global filter variables (lines 4061-4092)
- `_escapeClientName(clientName)` - escapes special characters (line 4297)

### 6. Update AppController.handleRunButtonClick (lines 1370-1410)

**Current Issues:**

- Calls methods with wrong signatures
- Has XML file fallback that doesn't work
- Missing client selection validation

**Fix to Match compApi.js (lines 4580-4879):**

- Validate `window.selectedClients_Array` exists and has clients selected
- Call `apiService.getRecordsForPeer(selectedYears)` with years only
- Call `apiService.getRecordsForClient(selectedYears)` with years only  
- Add proper error handling and loading states
- Use `validateAndNormalizeRecords()` helper
- Call `countUniqueClients()` after fetching peer data

### 7. Remove Unused Code

**Delete lines 1413-1463:**

- `fetchData()` method with XML file loading
- `fetchXmlData()` method
- These are not used in compApi.js

**Update method signatures:**

- `getSelectedRegions()` should use `window.selectedRegions_Array`
- `getSliderValue()` should use `window.sliderValue`
- Don't pass these as parameters to API methods

## Field ID Mappings for Standard Mode

### Peer Table Fields (Standard-specific):

- 195: s52 Formatted Year ✓
- 193: MAIN SurveyType ✓
- 123: s02 - Giving Units ✓
- 186/301: Client Name ✓
- 267: MAIN QueryRegions ✓
- 268: MAIN QueryMultisite ✓
- 304-312: CFHI STAND ratios
- 313-321: CFHI STAND YES NO fields
- 160: s39 - Contribution without donor restriction
- 161: s40 - Total Contribution
- 143: s18 - Total Cash
- 145: s20 - Non-Endowment Investment
- 164: s45 - Total Expense
- 165: s46 - Total Depreciation Expense
- And others used in data processing methods

### Client Table Fields (Standard-specific):

- 474: s52 Formatted Year ✓
- 98: Related Client ✓
- 105: Main_SurveyType ✓
- 211-212: CFHI STAND 01 (Days Operating Cash)
- 215-217: CFHI STAND 02 (Net Cash Availability)
- 218-220: CFHI STAND 03 (Debt to Contributions)
- 221-223: CFHI STAND 04 (Debt per Giving Unit)
- 224: CFHI STAND 05 (Contributions per GU)
- 227-228: CFHI STAND ratios
- 229: CFHI STAND 06
- 232-233: CFHI STAND 07-08
- 22: s02 - Giving Units
- 59-60: contribution fields

## Testing Validation

After changes, verify:

1. API calls are made to Quickbase (check Network tab)
2. Records are returned for both peer and client data
3. Data is processed and stored in dataStore
4. Charts display correctly with the retrieved data
5. Console shows no errors about missing data

### To-dos

- [ ] Add baseUrl, userToken, appId, and record arrays to ApiService constructor
- [ ] Rewrite getRecordsForPeer with recursive pattern and Standard-specific query/clist
- [ ] Rewrite getRecordsForClient with recursive pattern and Standard-specific query/clist
- [ ] Rewrite getRecordsForUniqueClientPeerNames to use actual Quickbase API calls
- [ ] Add getClientQuery, _initializeFilterHandlers, _handleFiltersChanged, _escapeClientName methods
- [ ] Update handleRunButtonClick to match compApi.js flow with proper validation
- [ ] Remove fetchData, fetchXmlData methods and XML file loading logic
- [ ] Test that data is successfully retrieved from Quickbase and processed