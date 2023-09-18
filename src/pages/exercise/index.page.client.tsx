import { Button, Card, CardContent, Paper, TextField } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

type CardInfo = {
  id: string;
  label: string;
};

const tickTimeMilis = 0;
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
  term: initialSearchTerm,
  length: 0,
  offset: 0,
};

export function Page() {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [cardInfos, setCardInfos] = useState([...startingItems]);
  const [searchResults, setSearchResults] = useState(emptySearchResults);
  const [searchResultsMeta, setSearchResultsMeta] = useState(
    initialSearchResultsMeta,
  );

  const updateSearchResults = useCallback(() => {
    if (searchTerm.length < 3) {
      return;
    }

    const searchUrl = `https://itunes.apple.com/search?term=${searchTerm}&media=music&limit=200`;
    fetch(searchUrl)
      .then((response) => response.json())
      .then((data) => {
        if (!data || !data.results || !data.results.length) {
          console.warn(`No search results for URL: ${searchUrl}`);
          setSearchResults(emptySearchResults);
          setSearchResultsMeta({
            term: searchTerm,
            length: 0,
            offset: 0,
          });
          return;
        }

        const results = data.results as any[];
        const sortedByAlbum = results
          .sort((a, b) =>
            a.collectionName === b.collectionName
              ? 0
              : a.collectionName < b.collectionName
              ? -1
              : 1,
          )
          // remove duplicates
          .filter(
            (result, index, self) =>
              index ===
              self.findIndex((r) => r.collectionId === result.collectionId),
          )
          .filter((r) => !!r.collectionName);

        const newSearchResults = sortedByAlbum.map((result: any) => ({
          id: `${result.collectionId}`,
          label: result.collectionName,
        }));

        setSearchResults(newSearchResults);
        setSearchResultsMeta({
          term: searchTerm,
          length: newSearchResults.length,
          offset: 0,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [searchTerm, setSearchResults]);

  const buildNewCardInfos = useCallback(() => {
    const newCardInfos = [...cardInfos.slice(1, 5)];

    if (searchResultsMeta.term === "") {
      newCardInfos.push(cardInfos[0]);
    } else {
      const popIndex = searchResultsMeta.offset % searchResults.length;

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
        offset: popIndex + 1,
      });
    }

    setCardInfos(newCardInfos);
  }, [cardInfos, searchResults, searchResultsMeta]);

  const handleTick = useCallback(() => {
    buildNewCardInfos();

    if (searchResultsMeta.term !== searchTerm) {
      updateSearchResults();
    }
  }, [
    buildNewCardInfos,
    searchResultsMeta.term,
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
    // console.debug(`New search term: ${searchInput} => ${encodedSearchInput}`);
  };

  useEffect(() => {
    if (tickTimeMilis) {
      const ticker = setInterval(() => {
        handleTick();
      }, tickTimeMilis);

      return () => clearInterval(ticker);
    }
  }, [handleTick]);

  return (
    <>
      <Paper elevation={2} style={{ width: "100%", padding: "1rem" }}>
        <TextField
          label="Search iTunes albums"
          onChange={handleSearchChange}
          style={{ width: "100%" }}
        />
        {cardInfos.map((cardInfo) => (
          <Card key={`card-${cardInfo.id}`} style={{ margin: " 1rem 0" }}>
            <CardContent>
              <div
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                  fontSize: "1.5rem",
                  height: "1.5rem",
                }}
              >
                {cardInfo.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </Paper>
      <div style={{ padding: "1rem" }}>
        <Button variant="contained" onClick={handleTick}>
          Tick
        </Button>
        <pre>{`${JSON.stringify(
          searchResultsMeta,
          null,
          2,
        )}\n\n${JSON.stringify(searchResults, null, 2)}`}</pre>
      </div>
    </>
  );
}
