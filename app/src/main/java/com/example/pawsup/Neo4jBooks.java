package com.example.pawsup;


import java.sql.Driver;
import static org.neo4j.driver.Values.parameters;

import org.neo4j.driver.AuthTokens;
import org.neo4j.driver.GraphDatabase;
import org.neo4j.driver.Result;
import org.neo4j.driver.Session;
import org.neo4j.driver.Transaction;



public class Neo4jBooks {

    private Driver driver;
    private String uriDb;

    public Neo4jBooks() {
        uriDb = "bolt://localhost:7687";
        driver = GraphDatabase.driver(uriDb, AuthTokens.basic("neo4j","1234"));
    }

    public void insertAuthor(String author) {
        try (Session session = driver.session()){
            session.writeTransaction(tx -> tx.run("MERGE (a:Author {author: $x})",
                    parameters("x", author)));
            session.close();
        }
    }

    public void insertTitle(String title) {
        try (Session session = driver.session()){
            session.writeTransaction(tx -> tx.run("MERGE (a:Title {title: $x})",
                    parameters("x", title)));
            session.close();
        }
    }

    public void insertBook(String author, String title) {
        try (Session session = driver.session()){
            session.writeTransaction(tx -> tx.run("MATCH (a:Author {author:$x}),"
                    + "(t:Title {title:$y})\n" +
                    "MERGE (a)-[r:WROTE]->(t)\n" +
                    "RETURN r", parameters("x", author, "y", title)));
            session.close();
        }
    }

    public void printBook(String author, String title)
    {
        try (Session session = driver.session())
        {
            try (Transaction tx = session.beginTransaction()) {
                Result node_boolean = tx.run("RETURN EXISTS( (:Author {author: $x})"
                                + "-[:WROTE]-(:Title {title: $y}) ) as bool"
                        ,parameters("x", author, "y", title) );
                if (node_boolean.hasNext()) {
                    System.out.println(author + " wrote " + title);
                }
            }
        }
    }

    public void close() {
        driver.close();
    }
}


