import Head from 'next/head';
import Image from 'next/image';
import Banner from '@components/Banner';
import Card from '@components/Card';
import { useEffect, useState, useContext } from 'react';
import styles from '../styles/Home.module.css';
import useTrackLocation from 'hooks/use-track-Location';
import { ACTION_TYPES, StoreContext } from '../store/storeContext';
import { fetchCoffeeStores } from '../lib/lib';

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: {
      coffeeStores,
    }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const { handleTrackLocation, locationErrMessage, isFindingLocation } =
    useTrackLocation();
  // const [coffestores, setCoffestores] = useState('');
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);
  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latLong } = state;

  const handleButtonClick = () => {
    handleTrackLocation();
  };

  useEffect(async () => {
    if (latLong) {
      try {
        const response = await fetch(
          `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`
        );
        const coffeeStores = await response.json();
        dispatch({
          type: ACTION_TYPES.SET_COFFEE_STORES,
          payload: {
            coffeeStores,
          },
        });
        setCoffeeStoresError('');
      } catch (error) {
        setCoffeeStoresError(error.message);
      }
    }
  }, [latLong]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? 'Loading...' : 'View Stores nearby'}
          handleOnClick={handleButtonClick}
        />
        <p>
          {locationErrMessage && `Something went wrong${locationErrMessage}`}
          {coffeeStoresError && (
            <p>Something went wrong: {coffeeStoresError}</p>
          )}
        </p>
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            alt="banner-hero"
            width={700}
            height={400}
          />
        </div>
        {coffeeStores.length > 0 && (
          <>
            <h2 className={styles.heading2}>Stores nearby</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((card) => {
                return (
                  <Card
                    key={card.id}
                    name={card.name}
                    imgUrl={
                      card.imgUrl ||
                      'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                    }
                    href={`/coffee-store/${card.id}`}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </>
        )}
        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
