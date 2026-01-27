SCENARIO 1 (This is how it is right now) - is only including the latest year of data if the latest year of data passes the query test. And tests the following years for data if they also pass the queries
	Attempt 1 - 2024 had 852gu and 2023 had 1032 --> CLIENT WAS NOT INCLUDED AT ALL
	Attempt 2 - 2024 had 1032 and 2023 had 852 --> CLIENT WAS INCLUDED IN 2024 but not 2023.


SCENARIO 2 (this is how it NEEDS to be) - take the most recent year of a client and test it against the query and if it passes than all years are included whether or not the following years pass the query
	Attempt 1 - 2024 had 852gu and 2023 had 1032 --> CLIENT WAS NOT INCLUDED AT ALL
	Attempt 2 - 2024 had 1032 and 2023 had 852 --> CLIENT WAS INCLUDED IN BOTH 2024 and 2023 because 2024 (most recent year) passed the query. And eventhough 2023 doesn't pass the query, it is still included in the peer data. 


so to clarify, 