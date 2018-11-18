package ru.dev4j;

import com.github.ccob.bittrex4j.BittrexExchange;
import com.github.ccob.bittrex4j.dao.Fill;
import com.github.ccob.bittrex4j.dao.OrderType;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Arrays;

public class SocketTest {

    public static void main(String[] args) throws IOException {

        System.out.println("Press any key to quit");

        String API_KEY = "***REMOVED***";
        String SECRET_KEY = "***REMOVED***";

        try (BittrexExchange bittrexExchange = new BittrexExchange(API_KEY, SECRET_KEY)) {


            bittrexExchange.onUpdateExchangeState(updateExchangeState -> {
                System.out.println("NEW UPDATE FOR " + updateExchangeState.getMarketName());
                System.out.println("NEW UPDATE BIDS : " + updateExchangeState.getBuys().length);
                System.out.println("NEW UPDATE ASKS : " + updateExchangeState.getSells().length);
            });


            bittrexExchange.connectToWebSocket(() -> {
                bittrexExchange.queryExchangeState("BTC-XRP", exchangeState -> {
                    System.out.println(String.format("BTC-XRP LOAD FIRST SNAPSHOT " + exchangeState.getBuys().length + " " + exchangeState.getSells().length));

                });
                bittrexExchange.subscribeToExchangeDeltas("BTC-XRP", null);

                bittrexExchange.queryExchangeState("BTC-ETH", exchangeState -> {
                    System.out.println(String.format("BTC-ETH LOAD FIRST SNAPSHOT " + exchangeState.getBuys().length + " " + exchangeState.getSells().length));

                });
                bittrexExchange.subscribeToExchangeDeltas("BTC-ETH", null);

                bittrexExchange.subscribeToMarketSummaries(null);
            });

        }

        System.out.println("Closing websocket and exiting");
    }

}
