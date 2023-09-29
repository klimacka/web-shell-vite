import React, { useCallback, useEffect, useState } from "react";
import "./style.scss";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

type CardInfo = {
  id: string;
  label: string;
};

const tickTimeMilis = 1000;
const startingItems: CardInfo[] = [
  { id: "starting-item-a", label: "A" },
  { id: "starting-item-b", label: "B" },
  { id: "starting-item-c", label: "C" },
  { id: "starting-item-d", label: "D" },
  { id: "starting-item-e", label: "E" },
];
const emptySearchResults: CardInfo[] = [];
const initialSearchTerm = "";
const initialSearchResultsMeta = {
  seachTerm: initialSearchTerm,
  popOffset: 0,
};

export function Page() {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [cardInfos, setCardInfos] = useState([...startingItems]);
  const [searchResults, setSearchResults] = useState(emptySearchResults);
  const [searchResultsMeta, setSearchResultsMeta] = useState(
    initialSearchResultsMeta,
  );

  const updateSearchResults = useCallback(() => {
    if (searchTerm.length < 2) {
      return;
    }

    const searchUrl = `https://itunes.apple.com/search?term=${searchTerm}&media=music`;
    fetch(searchUrl)
      .then((response) => response.json())
      .then((data) => {
        if (!data?.results?.length) {
          console.warn(`No search results for URL: ${searchUrl}`);
          setSearchResults(emptySearchResults);
          setSearchResultsMeta({
            seachTerm: searchTerm,
            popOffset: 0,
          });
          return;
        }

        const results = data.results as any[];
        const newSearchResults = results
          .filter((r) => !!r.collectionName)
          // remove duplicates
          .filter(
            (result, index, self) =>
              index ===
              self.findIndex((r) => r.collectionId === result.collectionId),
          )
          .sort((a, b) =>
            a.collectionName === b.collectionName
              ? 0
              : a.collectionName < b.collectionName
              ? -1
              : 1,
          )
          .map((result: any) => ({
            id: `${result.collectionId}`,
            label: result.collectionName,
          }));

        setSearchResults(newSearchResults);
        setSearchResultsMeta({
          seachTerm: searchTerm,
          popOffset: 0,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [searchTerm, setSearchResults]);

  const buildNewCardInfos = useCallback(() => {
    const newCardInfos = [...cardInfos.slice(1, 5)];

    if (searchResultsMeta.seachTerm === "") {
      newCardInfos.push(cardInfos[0]);
    } else {
      const popIndex = searchResultsMeta.popOffset % searchResults.length;

      const newCardItem = searchResults[popIndex];
      if (!newCardItem || newCardInfos.find((c) => c.id === newCardItem.id)) {
        newCardInfos.push(
          startingItems.find((s) => !newCardInfos.find((c) => c.id === s.id)),
        );
      } else {
        newCardInfos.push(searchResults[popIndex]);
      }

      setSearchResultsMeta({
        ...searchResultsMeta,
        popOffset: popIndex + 1,
      });
    }

    setCardInfos(newCardInfos);
  }, [cardInfos, searchResults, searchResultsMeta]);

  const handleTick = useCallback(() => {
    buildNewCardInfos();

    if (searchResultsMeta.seachTerm !== searchTerm) {
      updateSearchResults();
    }
  }, [
    buildNewCardInfos,
    searchResultsMeta.seachTerm,
    searchTerm,
    updateSearchResults,
  ]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchInput = event.target.value;
    // TODO: encode search input better
    const encodedSearchInput = searchInput.trim().replace(/\s+/g, "+");

    if (encodedSearchInput === searchTerm) {
      return;
    }

    setSearchTerm(encodedSearchInput);
    console.debug(`New search term: ${searchInput} => ${encodedSearchInput}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleTick();
    }, tickTimeMilis);

    return () => clearInterval(interval);
  }, [handleTick]);

  return (
    <>
      <Grid container spacing={2} style={{ width: "100%" }}>
        <Grid item xs={12}>
          <TextField
            label="Search iTunes albums"
            onChange={handleSearchChange}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Paper elevation={0}>
            {cardInfos.map((cardInfo) => (
              <Card key={`card-${cardInfo.id}`} className="list-item">
                <CardContent>
                  <Typography align="center">{cardInfo.label}</Typography>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button variant="contained" onClick={handleTick}>
            Tick
          </Button>
          <pre
            style={{ maxWidth: "30rem", overflow: "scroll" }}
          >{`${JSON.stringify(searchResultsMeta, null, 2)}\n${JSON.stringify(
            searchResults,
            null,
            2,
          )}`}</pre>
        </Grid>
      </Grid>
    </>
  );
}
